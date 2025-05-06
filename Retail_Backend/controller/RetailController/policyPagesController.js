const mongoose = require('mongoose');
const policyPage = require('../../models/policyPage');



const getPolicyPages = async (req, res) => {
  try {
    const { url } = req;
    if (url.includes("#") || url.includes("?") || url.includes("&")) {
      return res.status(400).json({ error: "Invalid API request" });
    }



    const data = await policyPage.find();
    return res.status(200).json({ success: true, message: "policyPage get successfully", data: data })
    //   console.log(data);

  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
const getPolicyPageByTitle = async (req, res) => {
  const title = req.query.title;
  try {
    if (!title) {
      return res.status(400).json({ success: false, message: "title is not provided" });
    }

    const data = await policyPage.findOne({title:title,status:"active"});
    return res.status(200).json({ success: true, message: "policyPage get successfully", data: data })

  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


module.exports = { getPolicyPages, getPolicyPageByTitle };