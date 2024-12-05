import { EmployeeProfileRepository } from '../Utils/Database Repositories/employeeProfileRepository';
import { EmployeeProfile } from '../Models/employeeProfile';

export class EmployeeProfileService {
    private employeeProfileRepositoryObject: EmployeeProfileRepository;

    constructor() {
        this.employeeProfileRepositoryObject = new EmployeeProfileRepository();
    }

    public async updateEmployeeProfile(profile: EmployeeProfile): Promise<void> {
        try {
            const existingProfile = await this.employeeProfileRepositoryObject.getEmployeeProfileByUserId(profile.user_id);
            if (existingProfile) {
                await this.employeeProfileRepositoryObject.updateProfile(profile);
            } else {
                await this.employeeProfileRepositoryObject.createProfile(profile);
            }
        } catch (error) {
            console.error("Error updating employee profile:", error);
            throw new Error("Failed to update employee profile");
        }
    }
}
