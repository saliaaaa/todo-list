//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose= require ("mongoose");
const _ =require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://saliaaa:8520@cluster0.5z4vcfg.mongodb.net/todolistDB")
const itemsSchema= {
  name: String
};
const Item= mongoose.model("item", itemsSchema);

const item1= new Item({
  name: "welcome to your todo list"
})

const item2= new Item({
  name: "hit+button to a off a new item"
})

const item3= new Item({
  name: "Hit this to delete an item"
})

const defaultItems= [item1, item2, item3];

// Item.insertMany(defaultItems)
//   .then(function(){

//    console.log("Successfully saved default items to DB");
//   })
//   .catch((err) => {
//    console.log(err);
//   });

const listSchema={
  name: String,
  items : [itemsSchema]
}

const List=mongoose.model("List", listSchema)

app.get("/", function(req, res) {

  Item.find()
  .then((foundItems) => {
    res.render("list", {listTitle: "Today", newListItems: foundItems});
    })

});


app.get("/:customListName",function(req,res){
  const customListName = _.capitalize(req.params.customListName);
 
  List.findOne({name:customListName})
    .then(function(foundList){
        
          if(!foundList){
            const list = new List({
              name:customListName,
              items:defaultItems
            });
          
            list.save();
            console.log("saved");
            res.redirect("/"+customListName);
          }
          else{
            res.render("list",{listTitle:foundList.name, newListItems:foundList.items});
          }
    })
    .catch(function(err){});
 
 
  
  
})



app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName=req.body.list;
  const item =new Item({
    name: itemName

  })

  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName })
   .then(function (foundList)
     {
       foundList.items.push(item);
       foundList.save();
       res.redirect("/" + listName);
     });
  }
 
});


  // if (req.body.list === "Work") {
  //   workItems.push(item);
  //   res.redirect("/work");
  // } else {
  //   items.push(item);
  //   res.redirect("/");
  // }


app.post("/delete", function(req, res){
  let checkedItemId = (req.body.checkbox.trim());
const listName=req.body.listName;

if ( listName === "Today"){
  Item.findByIdAndRemove(checkedItemID).then(function(){
    console.log("Sucessful removed");
  }) .catch(function(err){
    console.log("err");
  }); 

  res.redirect("/");
} 

else {
  List.findOneAndUpdate({name: listName}, {$pull:{ items:{_id: checkedItemId }}}, {new: true}).then(function(foundlist){
    res.redirect("/" + listName);
  }).catch( err => console.log(err));
  
}



});


app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started on port 3000");
});
