require('dotenv').config();
const express = require ('express');
const cors = require('cors');
const mongoose = require('mongoose');

const ListingDB =require("./modules/listingsDB");
const db= new ListingDB();

const app = express();
const HTTP_PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json()) 

app.get('/', (req, res) => {
    res.send('API listening');
});

//Initialize Database 
db.initialize(process.env.MONGODB_CONN_STRING).then(() => {
    app.listen(HTTP_PORT, () => {
        console.log(`Server listening on: ${HTTP_PORT}`);
    });
}).catch((err) => {
    console.log(err);
});


//routes
app.post('/api/listings', (req, res) => {

    const listingData = req.body;  // Get data from the request body
    // Call addListing and handle promise
    db.addListing(listingData)
        .then(result => {
        res.status(201).json(result); // Respond with the saved listing and HTTP status 201
        })
        .catch(error => {
            res.status(500).send({ message: error });  // Respond with error and HTTP status 500
        });
});

app.get('/api/listings/:id', (req, res) => {

    const { id } = req.params; // Get the _id from the URL parameter
    db.listingById(id)
        .then(listing => {
            res.status(200).json(listing); // Send the listing data as the response
        })
        .catch(error => {
            res.status(404).json({ error: error }); // Send error message if listing is not found
        });
});


app.get('/api/listings', (req, res) => {

    // Extract page and pageSize from the query string, default to 1 and 10 if not provided
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const pageSize = parseInt(req.query.pageSize) || 10; // Default to 10 items per page
    const name = req.query.name ? req.query.name.toLowerCase() : '';

    db.paginatedResults(page, pageSize,name)
        .then(results => {
            res.status(200).json(results); // Respond with the fetched listings
        })
        .catch(error => {
            res.status(404).json({ error: error }); // Send error message if listing is not found
        });
});

  
  
app.put('/api/listings/:id', (req, res) => {
    
    const id = req.params.id;  // Get the id from the route params
    const updateData = req.body;  // Get the update data from the request body

   db.updateListingById(id,updateData)
   .then(updatedListing =>{

        res.status(200).json(updatedListing); // Respond with the updated listing
    })
    .catch(error => {
        res.status(500).json({ error: 'Error updating the listing: ' + error.message });
    });

});
  
app.delete('/api/listings/:id', (req, res) => {

    const { id } = req.params; // Get the _id from the URL parameter
    
    db.deleteListingById(id)
    .then(deleteListing=>{

        res.status(200).json(deleteListing); //Listing deleted successfully
    })
    .catch(erro=>{
        res.status(404).json({ error: error }); // Return error if not found
    });

});

module.exports = app;