
// Only for testing
let XMLHttpRequest = require('xhr2');

let token;
let tokenURL = 'https://rooftop-career-switch.herokuapp.com/token?email=';
let getBlocksURL = 'https://rooftop-career-switch.herokuapp.com/blocks?token=';
let testBlockURL = 'https://rooftop-career-switch.herokuapp.com/check?token=';

let app = {};
/**
* Get auth token from external url
* @param    {String} email
* @return   {String}              
*/
app.getToken = function getToken (email) {
    console.log("Obtengo token...");
    return new Promise(function (resolve, reject) {
        const Http = new XMLHttpRequest();
        const url= tokenURL + email;
        Http.open("GET", url);
        Http.send();
        Http.onload =  function(){
            if(this.readyState == 4 && this.status == 200){
                let jsonResponse = JSON.parse(Http.response);
                if (jsonResponse.hasOwnProperty('token'))
                {
                    resolve(jsonResponse.token);
                }
                    
                else
                    reject();
            }
            else
                reject();
        }
    
    });
}

/**
* Get array data from external url
* @param    {String} token       auth token
* @return   {Array}              
*/
function getArrayData (token) {
    console.log("Obtengo datos a ordenar...");
    return new Promise(function (resolve, reject) {
        const Http = new XMLHttpRequest();
        const url= getBlocksURL + token;
        Http.open("GET", url);
        Http.send();
        Http.onload =  function(){
            if(this.readyState == 4 && this.status == 200){
                let jsonResponse = JSON.parse(Http.response);
                if (jsonResponse.hasOwnProperty('data'))
                    resolve(jsonResponse.data);
                else
                    reject();
            }
            else
                reject();
        }
    
    });
}
    
/**
* Check if block1 is followed by block2 
* @param    {String} token       auth token
* @param    {String} block1      
* @param    {String} block2      
* @return   {boolean}            true if block1 is followed by block2 
*/
function testBlockOrder (token, block1, block2) {

    try{
        // Create array and assing blocks to compare
        let array = [];
        array.push(block1);
        array.push(block2);

        let dataToSend ={'blocks':''};
        dataToSend.blocks = array;
        dataToSend = JSON.stringify(dataToSend);
        
        return new Promise(function (resolve, reject) {
            const Http = new XMLHttpRequest();
            const url= testBlockURL + token;
            Http.open("POST", url);
            Http.setRequestHeader("Content-Type", "application/json");
            Http.send(dataToSend);
            Http.onload =  function(){
                if(this.readyState == 4 && this.status == 200){

                    let jsonResponse = JSON.parse(Http.responseText);
                    
                    if (jsonResponse.hasOwnProperty('message'))
                        if (jsonResponse.message == true)
                            resolve(true);
                        else
                            resolve(false);
                            
                }
                
                
            }
            
        });
        }
        catch(error)
        {
            console.log("Error: ", error.message);
        }
    
}


/**
* Check if the array is ordered
* @param    {String} token       auth token
* @param    {String} array       
* @return   {boolean}            true if is ordered
*/
function testResultarray (token, array) {
    console.log("Chequeo resultado...");
    try{

        // Create array and assing blocks to compare
        let arrayToStr = array.toString();

        // Delete te ',' character
        arrayToStr = arrayToStr.replace(/,/g, '');


        let dataToSend ={'encoded':''};
        dataToSend.encoded = arrayToStr;
        dataToSend = JSON.stringify(dataToSend);

        
        return new Promise(function (resolve, reject) {
            const Http = new XMLHttpRequest();
            const url= testBlockURL + token;
            Http.open("POST", url);
            Http.setRequestHeader("Content-Type", "application/json");
            Http.send(dataToSend);
            Http.onload =  function(){
                if(this.readyState == 4 && this.status == 200){

                    let jsonResponse = JSON.parse(Http.responseText);
                    
                    if (jsonResponse.hasOwnProperty('message'))
                        if (jsonResponse.message == true)
                            resolve(true);
                        else
                            resolve(false);
                            
                }
                
                
            }
            
        });
        }
        catch(error)
        {
            console.log("Error: ", error.message);
        }
    
}

/**
* Solve recursively the blocks order
* @param    {String} token          auth token
* @param    {String} initialBlock   initial block
* @param    {Array} blocks          blocks array
* @return   {Array} resultArray     ordered array 
*/
async function resolveBlockOrder(initialBlock, blocks, token, resultArray)
{
    try{
        let ok = false;
        let i = 0;

        while(!ok && i < blocks.length)
        {
            if(await testBlockOrder(token, initialBlock, blocks[i]))
            {
                // Save actual element into result array
                resultArray[resultArray.length] = blocks[i];

                // Delete actual element from data array
                blocks.splice(i,1);

                ok = true;
            }
            i++;
        }

        // if there are blocks to order
        if(blocks.length > 0)
        {
            await resolveBlockOrder(resultArray[resultArray.length - 1], blocks, token, resultArray) // Call recursive method
        }
        else
        {
            return resultArray;
        }


            


    }
    catch(error)
    {
        console.log("Error: ", error.message);
    }
}

/**
* Solve recursively the blocks order
* @param    {String} token          auth token
* @param    {Array} blocks          blocks array to order
* @return   {Array}                 ordered array 
*/
app.check = async function check(blocks, token)
{
    try{

        if (typeof blocks !== "undefined" && typeof token !== "undefined" && Array.isArray(blocks) && blocks.length > 1)
        {
            console.log("Proceso y ordeno bloques. Aguarde...");
            // Get the initial block
            let initialBlock = blocks[0];
    
            // Save it into result array
            let resultArray = [];
            resultArray[0] = initialBlock;
            
            // Delete it from the data array
            blocks.splice(0, 1);
    
            // Call recursive function
            await resolveBlockOrder(initialBlock, blocks, token, resultArray);
    
    
    
            return resultArray;
        }
        else
            console.log("Parametros inválidos");


    }
    catch(error)
    {
        console.log("Error: ",  error.message);
        return [];
    }
}


app.test = async function test() {
    try{

        console.log("Ejecutando algoritmo. Aguarde....");
        // Get token
        token = await app.getToken("lograssofede@gmail.com");

        // Get data array
        let arrayData = await getArrayData(token);
        
        let resultArray = await app.check(arrayData,token);

        let boolResult = await testResultarray(token,resultArray);

        if(boolResult)
            console.log("Ordenamiento exitoso");
        else
            console.log("Ordenamiento falló");

    }
    catch(error)
    {
        console.log("Error: ",  error.message);
    }
    
}



module.exports = app;