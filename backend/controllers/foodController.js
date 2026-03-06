import foodModel from "../models/foodModel.js";
import upload from "../middleware/upload.js";
import fs from "fs";

// add food item
const addFood = async (req, res) => {
  const image_filename = `${req.file.filename}`;

  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_filename,
  });

  try {
    await food.save();
    res.json({ success: true, message: " food added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, messsage: "error" });
  }
};

// All Food List

const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "error" });
  }
};

// remove foodItem

const removeFood = async (req,res) =>{
  try {
    const food = await foodModel.findById(req.body.id)
    fs.unlink(`upload/${food.image}` ,() => {})

    await foodModel.findByIdAndDelete(req.body.id)
    res.json ({success : true,message:"food remove"})
  } catch (error) {
    console.log(error);
    res.json({success:false, message: "error"})
    
    
  }
}


export { addFood, listFood, removeFood };
