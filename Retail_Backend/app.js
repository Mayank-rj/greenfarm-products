const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const connectToMongo = require('./config/db');
const { CronJob } = require('cron');
const createBackup = require('./utils/backup');

const authenticateToken = require('./middleware/apiAuth');
const checkAdmin = require('./middleware/authAdmin');

const userRoutes = require("./routes/AdminRoutes/userRoutes");
const storeRoutes = require("./routes/AdminRoutes/storeRoutes");
const cityRoutes = require("./routes/AdminRoutes/cityRoutes");
const categoryRoutes = require("./routes/AdminRoutes/categoryRoutes");
const subcategoryRoutes = require("./routes/AdminRoutes/subcategoryRoutes");
const productRoutes = require("./routes/AdminRoutes/productRoutes");
const driverRoutes = require("./routes/AdminRoutes/driverRoutes");
const adminAuthRoutes = require("./routes/AdminRoutes/authRoutes");
const imageUploadRoute = require("./routes/AdminRoutes/imageUploadRoute");
const adminBannerRoutes = require("./routes/AdminRoutes/bannerRoutes");
const adminOrderRoutes = require("./routes/AdminRoutes/orderRoutes")
const adminPosConfigurationRoutes = require("./routes/AdminRoutes/posConfigurationRoutes")
const adminCouponRoutes = require("./routes/AdminRoutes/couponRoutes")
const adminPolicyPageRoutes = require("./routes/AdminRoutes/policyPageRoutes")
const adminSubMenuPageRoutes = require("./routes/AdminRoutes/subMenuRoutes")


const categoryRoutesRetail = require("./routes/RetailRoutes/categoryRoutes");
const productRoutesRetail = require("./routes/RetailRoutes/productRoute");
const orderRoutesRetail = require("./routes/RetailRoutes/orderRoutes");
const orderNumber = require("./routes/RetailRoutes/OrderNumber");
const barcodeproductRoutesRetail = require("./routes/RetailRoutes/barcodeProductsRoutes");
const storeRouteRetail = require("./routes/RetailRoutes/storeRoute");
const subcategoryRouteRetail = require("./routes/RetailRoutes/subCategoryRoute");
const subscriberRouteRetail = require("./routes/RetailRoutes/subscriberRoutes");
const policyPageRouteRetail = require("./routes/RetailRoutes/policyPagesRoute");
const bannerRouteRetail = require("./routes/RetailRoutes/bannerRoute");
const menuRouteRetail = require("./routes/RetailRoutes/menuRoute");
const cartRouteRetail = require("./routes/RetailRoutes/cartRoute");
const userRouteRetail = require("./routes/RetailRoutes/userRoute");
const coupanRouteRetail = require("./routes/RetailRoutes/coupanRoute");
const contactRouteRetail = require("./routes/RetailRoutes/contactRoute");
const transactionRouteRetail = require("./routes/RetailRoutes/transactionRoute");
const stripe = require("./routes/RetailRoutes/stripe")

const driverPosConfigurationRoutes = require("./routes/DriverRoutes/posconfigurationRoutes")

dotenv.config();
connectToMongo();

// Schedule a backup every 24 hour
const job = new CronJob(
    '0 0 * * *', // cronTime
    function () {
        console.log('Starting MongoDB backup...');
        createBackup()
    }, // onTick
    null, // onComplete
    true, // start
    'Australia/Sydney' // timeZone
);

const port = process.env.PORT || 5000;
const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
// app.use(express.static('public'));
app.use(cors({ origin: "*" }));

app.use('/api/admin/auth', authenticateToken, adminAuthRoutes)
app.use('/api/admin/user', authenticateToken, userRoutes)
app.use('/api/admin/store', authenticateToken, checkAdmin, storeRoutes)
app.use('/api/admin/category', authenticateToken, checkAdmin, categoryRoutes)
app.use('/api/admin/subcategory', authenticateToken, checkAdmin, subcategoryRoutes)
app.use('/api/admin/city', authenticateToken, checkAdmin, cityRoutes)
app.use('/api/admin/product', authenticateToken, checkAdmin, productRoutes)
app.use('/api/admin/driver', authenticateToken, checkAdmin, driverRoutes)
app.use('/api/admin/image', authenticateToken, checkAdmin, imageUploadRoute)
app.use('/api/admin/banner', authenticateToken, checkAdmin, adminBannerRoutes)
app.use('/api/admin/order', authenticateToken, checkAdmin, adminOrderRoutes)
app.use('/api/admin/posconfiguration', authenticateToken, checkAdmin, adminPosConfigurationRoutes)
app.use('/api/admin/coupon', authenticateToken, checkAdmin, adminCouponRoutes)
app.use('/api/admin/policypage', authenticateToken, checkAdmin, adminPolicyPageRoutes)
app.use('/api/admin/submenu', authenticateToken, checkAdmin, adminSubMenuPageRoutes)


app.use('/api/retail/category', authenticateToken, categoryRoutesRetail)
app.use('/api/retail/product', authenticateToken, productRoutesRetail)
app.use('/api/retail/order', authenticateToken, orderRoutesRetail)
app.use('/api/retail/ordernumber', authenticateToken, orderNumber)
app.use('/api/retail/barcodeproduct', authenticateToken, barcodeproductRoutesRetail)
app.use('/api/retail/store', authenticateToken, storeRouteRetail)
app.use('/api/retail/subcategory', authenticateToken, subcategoryRouteRetail)
app.use('/api/retail/subscriber', authenticateToken, subscriberRouteRetail)
app.use('/api/retail/banner', authenticateToken, bannerRouteRetail)
app.use('/api/retail/policy', authenticateToken, policyPageRouteRetail)
app.use('/api/retail/menu', authenticateToken, menuRouteRetail)
app.use('/api/retail/cart', authenticateToken, cartRouteRetail)
app.use('/api/retail/user', authenticateToken, userRouteRetail)
app.use('/api/retail/coupan', authenticateToken, coupanRouteRetail)
app.use('/api/retail/contact', authenticateToken, contactRouteRetail)
app.use('/api/retail/transaction', authenticateToken, transactionRouteRetail)
app.use('/api/retail/stripe', authenticateToken, stripe)


app.use('/api/driver/posconfiguration', authenticateToken, driverPosConfigurationRoutes)

app.listen(port, () => {
    console.log(`E-commerce backend listening at http://localhost:${port}`)
})
