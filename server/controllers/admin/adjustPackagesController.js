const { default: mongoose } = require('mongoose');
const packageModel = require('../../models/Package');




const addPackage = async(req,res) => {
    const{name, price ,doctor_discount,medicine_discount,family_discount}  = req.body;

    const package= await packageModel.findOne({name:name});

   
  try{

    if (!package){
        const package = await packageModel.create({name, price ,doctor_discount,medicine_discount,family_discount});
        res.status(200).json(package)
    }
    else{
      res.status(409).json({ message: 'Package already exists' });
    }
  }
  catch(error){
        res.status(400).json({error:error.message})
    }
  
  
}




const updatePackage = async (req, res) => {
  
  const updatedData = req.body;
  const oldname=req.body.oldname;
  delete updatedData.oldname


  // Function to safely trim a string or return undefined if it's not a string
  const trimString = (str) => (typeof str === 'string' ? str.trim() : undefined);

  // Check and update each attribute
  updatedData.name = trimString(updatedData.name);
  //console.log(updatedData);
 
  if (
    updatedData.name !== undefined &&
    updatedData.name === '' // Check if it's an empty string
  ) {
    delete updatedData.name; // Remove the attribute if it's empty
  }
  
  if ( updatedData.price ===''  &&  typeof updatedData.price !== 'number' ){
    delete updatedData ['price'];
  }

  if ( updatedData.doctor_discount ===''  &&  typeof updatedData.doctor_discount !== 'number' ){
    delete updatedData ['doctor_discount'];
  }

  if ( updatedData.medicine_discount ===''  &&  typeof updatedData.medicine_discount !== 'number' ){
    delete updatedData ['medicine_discount'];
  }

  if ( updatedData.family_discount ===''  &&  typeof updatedData.family_discount !== 'number' ){
    delete updatedData ['family_discount'];
  }


  try {
    // Find the package by ID and update its attributes
    const package = await packageModel.findOne({ name: oldname }); 

  if (package){
    const packageId = package._id;
    const updatedPackage = await packageModel.findByIdAndUpdate(packageId, updatedData, { new: true });



    if (!updatedPackage) {
      return res.status(404).json({ message: 'Package not found' });
    }

    res.status(200).json({ message: 'Package updated', package: updatedPackage });
  }}
 
   catch (error) {
    res.status(500).json({ error: 'Failed to update package', details: error.message });
  }

}



   



const deletePackage = async (req, res) => {

try{

    const name= req.body;
    const foundPackage = await packageModel.findOne({ name: name.name }) ;
    
    if (!foundPackage) {
      console.log('Package not found');
      res.status(404).json({ message: 'Package not found'});

    } 
    else {
       packageId = foundPackage._id;
       const deletedPackage = await packageModel.findByIdAndDelete(packageId);
       res.status(200).json({ message: 'Package deleted', package: deletedPackage });
    }
}

catch(error){
    res.status(500).json({ error: 'Failed to delete package', details: error.message });
}
}



const viewPackage = async (req, res) => {
    const package = await packageModel.find();
    res.status(200).json(package)
 }






  



module.exports = {addPackage,updatePackage,deletePackage,viewPackage};