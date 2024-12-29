import Stripe from "stripe"

// TODO: Get rid of non-null assertion operator
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export default stripe