const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 6001;
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
 
// const stripe = Stripe('sk_test_51OqzgWSHrm4Bc8TeiNxDVjBBIx3EcYaWzLr1OPylpVWPouKdHRx7DF2bXytzn444rnNW9NYylC6TF19WL2gFiHL8007Hvno915');
const Stripe = require('stripe');
const stripe = Stripe('sk_test_51OqzgWSHrm4Bc8TeiNxDVjBBIx3EcYaWzLr1OPylpVWPouKdHRx7DF2bXytzn444rnNW9NYylC6TF19WL2gFiHL8007Hvno915');
require("dotenv").config();

// console.log(process.env.DB_USER);
// console.log(process.env.DB_PASSWORD);
 
console.log(process.env.STRIPE_SECRET_KEY);


// username :titirsmail
// password: Y0QpG8ZQGEKNU0Nr

// middlewares
app.use(cors());
app.use(express.json());

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hhrks5x.mongodb.net/foodappdb?retryWrites=true&w=majority`)
  .then(
    console.log("mongodb connected successfully")
  )
  .catch((error)=>console.log("error connecting to mongodb",error));

// jwt authentication
app.post("/jwt", async (req, res) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1hr",
  });
  res.send({ token });
});

// importing routes
const menuRoutes = require("./api/routes/menuRoutes");
const cartRoutes = require("./api/routes/cartRoutes");
const userRoutes = require("./api/routes/userRoutes");
const paymentRoutes = require("./api/routes/paymentRoute");
app.use("/menu", menuRoutes);
app.use("/carts", cartRoutes);
app.use("/users", userRoutes);
app.use("/payments", paymentRoutes);

// stripe payment routes

app.post("/create-payment-intent", async (req, res) => {
  const { price } = req.body;
  const amount = price * 100;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "inr",
    payment_method_types: ["card"],
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

app.get("/", (req, res) => {
  res.send("Hello World this is foodApp!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});