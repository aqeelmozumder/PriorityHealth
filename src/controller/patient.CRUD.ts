import mongoose from "mongoose";
import Patient from "../models/Patient";
import PatientInfo from "../types/patientInfo";
import {
  ResponseProperties,
  TypedRequest,
  TypedResponse,
} from "../types/request&response";
import PMScore from "./PMScore";

// Create and Save a new Patient info
export const create = async (
  req: TypedRequest<PatientInfo>,
  res: TypedResponse<ResponseProperties>
): Promise<void> => {
  //Get form data from FE
  const formData: PatientInfo = {
    phn: req.body.phn,
    name: req.body.name,
    dob: req.body.dob,
    gender: req.body.gender,
    email: req.body.email,
    indigenous: req.body.indigenous,
    pain: req.body.pain,
    socialSupport: req.body.socialSupport,
    familyIllness: req.body.familyIllness,
    prescriptionMed: req.body.prescriptionMed,
    mentalHealth: req.body.mentalHealth,
    otherDrugUse: req.body.otherDrugUse,
    movingAbility: req.body.movingAbility,
    feedingAbility: req.body.feedingAbility,
    takeCareAbility: req.body.takeCareAbility,
    controlBladderFunction: req.body.controlBladderFunction,
  };

  // Calculate Patient Metric Score based off their data input in the form
  const pmScore: number = PMScore.calcultePMS(formData);

  const patientData = new Patient({ ...formData, pmScore: pmScore });

  // Save patient data in the database
  try {
    const savedPatientData = await patientData.save();
    res.send(savedPatientData);
  } catch (err) {
    if (err instanceof mongoose.Error) {
      console.log("whats up");
      res.status(500).json({
        message: err.message,
      });
    } else {
      res.status(500).json({message: "Some error occurred while saving patient info."});
    }
  }
};
