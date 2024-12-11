import doctorModel from "@models/doctor/doctor.model";
import { IDoctor } from "@interfaces/doctor";
import bcrypt from "bcrypt";

export const login = async (email: string, password: string) => {
  try {
    const doctorByEmail = await doctorModel.findOne({ email});
    if (!doctorByEmail)
      throw new Error("No existe doctor con ese email");

    if (!await bcrypt.compare(password, doctorByEmail.password))
      throw new Error("Contraseña incorrecta");

    return doctorByEmail;
  } catch (error: any) {
    throw new Error(`Error al loguear doctor: ${error.message}`);
  }
}
export const existByEmail = async (email: string): Promise<boolean> => {
  try {
    return !!(await doctorModel.findOne({email}));
  } catch (error: any) {
    throw new Error("Internal Server Error");
  }
};
export const create = async (doctor: IDoctor) => {
  try {
    const createdDoctor = await doctorModel.create(doctor);
    return createdDoctor;
  } catch (error: any) {
    throw new Error(`Error creando doctor: ${error.message}`);
  }
};

export const get = async (id: string) => {
  try {
    const doctor = await doctorModel.findById(id);
    if (!doctor)
      throw new Error("Doctor no encontrado");
    doctor.workingHours = doctor.workingHours ?? { start: "09:00", end: "17:00", daysOff: [] };
    return doctor;
  } catch (error: any) {
    throw new Error(`Error devolver doctor: ${error.message}`);
  }
};

export const getAll = async () => {
  try {
    const doctors = await doctorModel.find();
    return doctors;
  } catch (error: any) {
    throw new Error(`Error devolviendo doctores: ${error.message}`);
  }
};

export const getByEmail = async (email: string) => {
  try {
    const doctor = await doctorModel.findOne({ email });
    if (!doctor)
      throw new Error("Doctor no encontrado");
    return doctor;
  } catch (error: any) {
    throw new Error(`Error devolviendo doctor por email: ${error.message}`);
  }
};

export const update = async (id: string, doctor: IDoctor) => {
  try {
    const updatedDoctor = await doctorModel.findByIdAndUpdate(id, doctor, {
      new: true,
      runValidators: true,
    });
    return updatedDoctor;
  } catch (error: any) {
    throw new Error(`Error actualizando doctor: ${error.message}`);
  }
};

export const deleteById = async (id: string) => {
  try {
    const deletedDoctor = await doctorModel.findByIdAndDelete(id);
  } catch (error: any) {
    throw new Error(`Error eliminando doctor por ID: ${error.message}`);
  }
};