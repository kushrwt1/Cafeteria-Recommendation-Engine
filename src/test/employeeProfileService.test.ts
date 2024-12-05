import { EmployeeProfileRepository } from '../Utils/Database Repositories/employeeProfileRepository';
import { EmployeeProfileService } from '../Services/employeeProfileService';
import { EmployeeProfile } from '../Models/employeeProfile';

// Mock the EmployeeProfileRepository class
jest.mock('../Utils/Database Repositories/employeeProfileRepository');

describe('EmployeeProfileService', () => {
    let employeeProfileService: EmployeeProfileService;
    let employeeProfileRepositoryMock: jest.Mocked<EmployeeProfileRepository>;

    beforeEach(() => {
        // Manually create a mock instance
        employeeProfileRepositoryMock = {
            getEmployeeProfileByUserId: jest.fn(),
            updateProfile: jest.fn(),
            createProfile: jest.fn()
        } as unknown as jest.Mocked<EmployeeProfileRepository>;
        
        // Inject the mock into the EmployeeProfileService
        employeeProfileService = new EmployeeProfileService();
        (employeeProfileService as any).employeeProfileRepositoryObject = employeeProfileRepositoryMock;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should update existing profile', async () => {
        const profile: EmployeeProfile = {
            id: 1,
            user_id: 1,
            dietary_preference: 'Vegetarian',
            spice_level: 'Medium',
            cuisine_preference: 'Indian',
            sweet_tooth: true,
            profile_update_date: new Date().toISOString(),
        };

        // Set up mock return values
        employeeProfileRepositoryMock.getEmployeeProfileByUserId.mockResolvedValue(profile);
        employeeProfileRepositoryMock.updateProfile.mockResolvedValue();

        await employeeProfileService.updateEmployeeProfile(profile);

        // Assertions
        expect(employeeProfileRepositoryMock.getEmployeeProfileByUserId).toHaveBeenCalledWith(profile.user_id);
        expect(employeeProfileRepositoryMock.updateProfile).toHaveBeenCalledWith(profile);
        expect(employeeProfileRepositoryMock.createProfile).not.toHaveBeenCalled();
    });

    it('should create new profile if it does not exist', async () => {
        const profile: EmployeeProfile = {
            id: 1,
            user_id: 1,
            dietary_preference: 'Vegetarian',
            spice_level: 'Medium',
            cuisine_preference: 'Indian',
            sweet_tooth: true,
            profile_update_date: new Date().toISOString(),
        };

        // Set up mock return values
        employeeProfileRepositoryMock.getEmployeeProfileByUserId.mockResolvedValue(null);
        employeeProfileRepositoryMock.createProfile.mockResolvedValue();

        await employeeProfileService.updateEmployeeProfile(profile);

        // Assertions
        expect(employeeProfileRepositoryMock.getEmployeeProfileByUserId).toHaveBeenCalledWith(profile.user_id);
        expect(employeeProfileRepositoryMock.createProfile).toHaveBeenCalledWith(profile);
        expect(employeeProfileRepositoryMock.updateProfile).not.toHaveBeenCalled();
    });
});
