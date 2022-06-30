const liveProcessor = require("../data_processors/livelihoods.processor");
const livelihood = require("../data_calculators/livelihood.calculator");

const foodSecProcessor = require("../data_processors/foodSecurity.processor.js");
const foodSecCalculator = require("../data_calculators/foodSecurity.calculator.js");

const livestockProcessor = require("../data_processors/livestock.processor");

const allPagesProcessor = require("../data_processors/allPages.processor");

// Get Schema
const data = require("../models/data.model.js");

//
const APIPageMap = {
  livelihoods: liveProcessor.getDataForAPI,
  foodSecurity: foodSecProcessor.getDataForAPI,
  livestock: livestockProcessor.getDataForAPI,
  allPages: allPagesProcessor.getDataForAPI,
};


// Retrieve data by condition from the MongoDB database
// Must have dataType !!
const getRawData = async (dataType, project, form) => {
  const projectID = project || {$ne: undefined};
  const formID = form || {$ne: undefined};
  let condition = {dataType: dataType, projectID: projectID, formID: formID};

  let resultData = await data.find(condition);
  console.log(resultData.length + " records of " + dataType); // wzj
  return resultData;
};

//
const buildAPIData = async (project, form, pageType) => {
  const indicatorDataList = await getRawData("indicator_data", project, form);
  const processedDataList = await getRawData("processed_data", project, form);
  const dataForAPI = APIPageMap[pageType](indicatorDataList, processedDataList);
  console.log(dataForAPI.length + ": APIData of " + pageType); // wzj
  return dataForAPI;
};


// Retrieve data by dataType
exports.findRawDataByDataType = (req, res) => {
  const dataType = req.params.datatype;
  const projectID = req.query.projectid;
  const formID = req.query.formid;

  getRawData(dataType, projectID, formID)
    .then(data => {
      console.log(data.length + ": findDataByDataType"); // wzj
      res.send(data);
    })
    .catch(err => {
      res.status(500).send(
        {message: err.message || "Some error occurred while retrieving data."}
      );
    });
};


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
/*              Functions for getting API data for All Pages                */
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
exports.getAllPages = (req, res) => {
  const projectID = req.query.projectid;
  const formID = req.query.formid;

  buildAPIData(projectID, formID, "allPages")
    .then(data => {
      console.log(data.length); // wzj
      res.send(data);
    })
    .catch(err => {
      res.status(500).send(
        {message: err.message || "Some error occurred while retrieving data."}
      );
    });
};


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
/*          Functions for getting API data for Livelihoods Page           */
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
exports.getAllLivelihoods = (req, res) => {
  const projectID = req.query.projectid;
  const formID = req.query.formid;

  buildAPIData(projectID, formID, "livelihoods")
    .then(data => {
      console.log(data.length); // wzj
      res.send(data);
    })
    .catch(err => {
      res.status(500).send(
        {message: err.message || "Some error occurred while retrieving data."}
      );
    })
};


// Livelihood by EYang
exports.findTVA = (req,res) => {
  const projectID = req.query.projectid;
  const formID = req.query.formid;

  buildAPIData(projectID, formID)
    .then(data => {
      console.log(data.length); // wzj
      res.send(livelihood.buildTVA(data));
    })
    .catch(err => {
      res.status(500).send(
        {message: err.message || "Some error occurred while retrieving data."}
      );
    });
}

exports.findIncomeCat = (req,res) => {
  const projectID = req.query.projectid;
  const formID = req.query.formid;

  buildAPIData(projectID, formID)
    .then(data => {
      console.log(data.length); // wzj
      res.send(livelihood.buildIncomeCat(data));
    })
    .catch(err => {
      res.status(500).send(
        {message: err.message || "Some error occurred while retrieving data."}
      );
    });
}

exports.findAnnualValue = (req,res) => {
  const projectID = req.query.projectid;
  const formID = req.query.formid;

  buildAPIData(projectID, formID)
    .then(data => {
      console.log(data.length); // wzj
      res.send(livelihood.buildAnnualValue(data));
    })
    .catch(err => {
      res.status(500).send(
        {message: err.message || "Some error occurred while retrieving data."}
      );
    });
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
/*          Functions for getting API data for Food Security Page           */
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
exports.getAllFoodSecurity = (req, res) => {
  const projectID = req.query.projectid;
  const formID = req.query.formid;

  buildAPIData(projectID, formID, "foodSecurity")
    .then(data => {
      console.log(data.length); // wzj
      res.send(data);
    })
    .catch(err => {
      res.status(500).send(
        {message: err.message || "Some error occurred while retrieving data."}
      );
    });
};

//
exports.findHFIAS = (req, res) => {
  const projectID = req.query.projectid;
  const formID = req.query.formid;

  buildAPIData(projectID, formID, "foodSecurity")
    .then(data => {
      console.log(data.length); // wzj
      res.send(foodSecCalculator.count(data, "HFIAS"));
    })
    .catch(err => {
      res.status(500).send(
        {message: err.message || "Some error occurred while retrieving data."}
      );
    });
};

exports.findFoodShortage = (req, res) => {
  const projectID = req.query.projectid;
  const formID = req.query.formid;

  buildAPIData(projectID, formID, "foodSecurity")
    .then(data => {
      console.log(data.length); // wzj
      res.send(foodSecCalculator.buildFoodShortageData(data));
    })
    .catch(err => {
      res.status(500).send(
        {message: err.message || "Some error occurred while retrieving data."}
      );
    });
};

exports.findHDDS = (req, res) => {
  const projectID = req.query.projectid;
  const formID = req.query.formid;

  buildAPIData(projectID, formID, "foodSecurity")
    .then(data => {
      console.log(data.length); // wzj
      res.send(foodSecCalculator.buildHDDSData(data));
    })
    .catch(err => {
      res.status(500).send(
        {message: err.message || "Some error occurred while retrieving data."}
      );
    });
};

exports.findFoodConsumed = (req, res) => {
  const projectID = req.query.projectid;
  const formID = req.query.formid;

  buildAPIData(projectID, formID, "foodSecurity")
    .then(data => {
      console.log(data.length); // wzj
      res.send(foodSecCalculator.buildFoodConsumedData(data));
    })
    .catch(err => {
      res.status(500).send(
        {message: err.message || "Some error occurred while retrieving data."}
      );
    });
};


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
/*            Functions for getting API data for Livestock Page             */
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
exports.getAllLivestock = (req, res) => {
  const projectID = req.query.projectid;
  const formID = req.query.formid;

  buildAPIData(projectID, formID, "livestock")
    .then(data => {
      console.log(data.length); // wzj
      res.send(data);
    })
    .catch(err => {
      res.status(500).send(
        {message: err.message || "Some error occurred while retrieving data."}
      );
    })
};

