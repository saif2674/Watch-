const admin = require("firebase-admin");

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { items, customerName, customerPhone, customerAddress } = req.body;

    if (!customerName || !customerPhone || !customerAddress) {
      return res.status(400).json({ error: "Missing customer details" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const orderItems = [];
    let total = 0;

    for (const cartItem of items) {
      const productId = String(cartItem.id);
      const qty = Number(cartItem.qty);

      if (!qty || qty < 1) {
        return res.status(400).json({ error: `Invalid quantity for product ${productId}` });
      }

      const productSnap = await db.collection("products").doc(productId).get();

      if (!productSnap.exists) {
        return res.status(400).json({ error: `Product ${productId} not found` });
      }

      const product = productSnap.data();

      if (product.inStock === false) {
        return res.status(400).json({ error: `${product.name} is out of stock` });
      }

      if (typeof product.stockCount === "number" && qty > product.stockCount) {
        return res.status(400).json({ error: `Only ${product.stockCount} left for ${product.name}` });
      }

      const realPrice = product.price;
      total += realPrice * qty;

      orderItems.push({
        id: product.id,
        name: product.name,
        price: realPrice,
        qty: qty
      });
    }

    const orderRef = await db.collection("orders").add({
      customerName: String(customerName),
      customerPhone: String(customerPhone),
      customerAddress: String(customerAddress),
      items: orderItems,
      total: total,
      status: "New",
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return res.status(200).json({
      success: true,
      orderId: orderRef.id,
      total: total,
      items: orderItems
    });

  } catch (err) {
    console.error("create-order error:", err);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};
