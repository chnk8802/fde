import Order from '../models/orderModel.js';

export const placeOrder = async (req, res) => {
  try {
    const { customerName, address, phone, items, totalAmount } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    const newOrder = new Order({
      customerName,
      address,
      phone,
      items,
      totalAmount
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);

    setTimeout(async () => {
    const updated = await Order.findByIdAndUpdate(
        newOrder._id, 
        { status: 'Confirmed' }, 
        { new: true }
    );

    const io = getIO();
    io.to(newOrder._id.toString()).emit('orderUpdate', updated);
  }, 10000);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['Pending', 'Confirmed', 'Out for Delivery', 'Delivered', 'Cancelled'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status update" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const io = getIO();
    io.to(order._id.toString()).emit('orderUpdate', order);

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};