/* When the user passes the unix timestamp or natural language date as a string, 
it is handled here */

var express = require('express'); // Import Express module
var router = express.Router(); // Initiate a new Express Router
router.get('/', function(req, res, next) { // GET home page. '/' is the home directory 
    /* Render the page with res.render(); 1st param: pass the name of the view file to render ('index') & therefore look in the views 
    dir for index.jade, then renders it; 2nd param: pass an object which is used to pass along info/data to our views when we render 
    them (pass the template that converts to index.html (index.js) a title 'Timestamp Microservice'. */
  res.render('index', { title: 'Timestamp Microservice' });
});

// Output the string that comes after '/:' where time is just a placeholder variable for that string the users types in. 
router.get('/:time', function(req, res) {
    /* Create a function that: 1) takes a unix time and converts it to a human readable date 2) Returns an Object w/ the converted date 
    as well as unixtime; 'unix' is passed by 'if' below checking if URL param contains numbers only. */
    function unixToNatural(unix) {
        /* Convert the unixtime (in seconds) to ms by multiplying by 1000; pass the result to create a New Date Object corresponding 
        to the unixtime and store result in 'time'. */
        var time = new Date(unix * 1000),
        // Create an array of strings for each month of the year; store array in 'months'
        months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        /* Convert the 0-indexed month (0-11) returned by extracting the month from the date obj & pass the value to the string array of 
        months. The index value of each month string in the array directly correspond to the 0-indexed month returned, hence pass the 
        0-indxed month extracted as the index to access the month string value; store the string in 'month'. */
        month = months[time.getMonth()],
        date = time.getDate(), // Extract the day of the month from the date obj
        year = time.getFullYear(), // Extract the year from the date obj
        naturalDate = month + ' ' + date + ', ' + year, // Create the human readable date string & store in 'naturalDate'
        // Create an object holding both the unixtime (time / 1000) & human readable date (naturalDate) 
        data = {
            // Divide the date object by 1000 to get the unixtime (dividing a date obj converts the date to the num of ms since Jan 1, 1970)
            unix: time / 1000,
            natural: naturalDate // Pass the human readable date string
        };
        return data; // Return the data object 
    }
    /* Checks if URL parameter contains numbers only w/ req.params.time (time corresponds to '/:time'); if a unix time is given, !isNaN() 
    will return TRUE because the argument IS a number. */
    if (!isNaN(req.params.time)) {
        /* Return an object w/ both the unixtime & unixtime converted to human readable date; then store in result. */
        var result = unixToNatural(req.params.time);
        res.json(result); // Send back the result object as an HTTP JSON response
    } else { // Check if URL param contains a VALID date
        /* Create a New Date Object w/ the given date string, isNaN() converts valid dates to a number; hence !isNaN() will return TRUE 
        if a valid date is passed by the result of new Date(). */
        if (!isNaN(new Date(req.params.time))) {
            // Create a new Date obj passing the data given by the user & store in d
            var d = new Date(req.params.time),
                x = d.getFullYear(), // Extract the year
                y = d.getMonth(), // Extract the month
                z = d.getDate(), // Extract the day
                /* Pass the extracted Year, Month, & Day into Date.UTC() to return a Date obj containing the number of ms since 
                Jan 1, 1970; convert the ms to a New Date Object; store the result in 'utc'. */
                utc = new Date(Date.UTC(x, y, z)),
                /* Convert the utc date to the number of ms since Jan 1, 1970; then divide by 1000 to convert to unix time 
                (which is in seconds). Store the unix time in 'unix'. */
                unix = Date.parse(utc) / 1000;
            // Return an object w/ both the unixtime & unixtime converted to human readable date; then store in result2. 
            var result2 = unixToNatural(unix);
            res.json(result2); // Send back the result object as an HTTP JSON response
        } else { // If URL param ISN'T a VALID date
            // Send back an object containing both the unixtime & human readable date values set to null as an HTTP JSON response. 
            res.json({ unix: null, natural: null });
        }
    } 
});

module.exports = router; // Export the router
