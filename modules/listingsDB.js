const mongoose = require('mongoose');
const SampleAirbnb = require('./listingSchema');

class ListingDB {
    initialize(connectionString) {
        return mongoose.connect(connectionString)
            .then(() => console.log('MongoDB Connected'))
            .catch(err => console.log('MongoDB connection error:', err));
    }

    // add new listing 
    addListing(listingData) {
        return new Promise((resolve, reject) => {
            // Create a new listing using the schema
            const newListing = new SampleAirbnb(listingData);
    
            // Save the new listing to MongoDB
            newListing.save()
                .then(savedListing => {
                    resolve(savedListing); // Successfully saved, resolve the promise with the saved listing
                })
                .catch((error) => {
                    reject('Error saving listing: ' + error); // If there's an error, reject the promise
                });
        });
    }

    // Return a listing by its _id
    listingById(id){
        return new Promise ((resolve, reject) =>{
            SampleAirbnb.findOne({ _id: id })  // Search for listing by string _id
            .then(listing=>{
                if (listing) {
                    resolve(listing); // If found, resolve the promise with the data
                } else {
                    reject("Listing not found"); // If not found, reject the promise with a message
                }
            })
            .catch(error => {
                reject("Error retrieving listing: " + error.message); // If an error occurs, reject the promise with the error message
            });
        });
    }


    // Return paginated results 

    paginatedResults(page, pageSize, filter ={}) {
        return new Promise((resolve, reject) => {
            const skip = (page - 1) * pageSize; // Calculate how many results to skip
    
            // Find the results in the database
            SampleAirbnb.find() // Find all records
                .skip(skip) // Skip the results corresponding to the page
                .limit(pageSize) // Limit the results to the page size
                .then(results => {
                    // Just return the results, without pagination metadata
                    resolve(results);
                })
                .catch(error => {
                    reject('Error retrieving the results: ' + error.message); // If there's an error retrieving the results
                });
        });
    }

    //Update a listing by _id

    updateListingById(id,updateData){
        return new Promise((resolve,reject)=>{

            SampleAirbnb.findByIdAndUpdate(id,updateData,{ new: true }) // `new: true` returns the updated document
            .then(updateListing =>{
                resolve(updateListing) // Resolve with the updated listing data
            })
            .catch(error =>{
                reject('Error updating the : ' + error.message); // If there's an error upadating the results
            });
        });
    }

    //Delete a listing by _id

    deleteListingById(id){
        return new Promise((resolve,reject)=>{
            SampleAirbnb.findOneAndDelete({_id: id})
            .then(deleteListing =>{
                if(deleteListing){      // Return the deleted listing
                    resolve(deleteListing);
                }
            })
            .catch(error =>{ 
                reject('Error deleting the listing: '+ error.message);

            });
        });
    }
}



module.exports = ListingDB;


