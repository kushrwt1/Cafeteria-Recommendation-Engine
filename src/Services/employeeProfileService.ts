import { EmployeeProfileRepository } from '../Utils/Database Repositories/employeeProfileRepository';
import { EmployeeProfile } from '../Models/employeeProfile';
import { MenuItem } from '../Models/menuItem';

export class EmployeeProfileService {
    private employeeProfileRepositoryObject: EmployeeProfileRepository;

    constructor() {
        this.employeeProfileRepositoryObject = new EmployeeProfileRepository();
    }

    public async updateEmployeeProfile(profile: EmployeeProfile): Promise<void> {

        const existingProfile = await this.employeeProfileRepositoryObject.getEmployeeProfileByUserId(profile.user_id);
        if (existingProfile) {
            await this.employeeProfileRepositoryObject.updateProfile(profile);
        } else {
            await this.employeeProfileRepositoryObject.createProfile(profile);
        }
    }

}
