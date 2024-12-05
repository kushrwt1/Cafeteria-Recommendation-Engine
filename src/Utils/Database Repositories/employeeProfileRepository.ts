import { db } from "../../Database/database";
import { EmployeeProfile } from "../../Models/employeeProfile";

export class EmployeeProfileRepository {
  public async createProfile(profile: EmployeeProfile): Promise<void> {
    await db.execute(
      "INSERT INTO Employee_Profile (user_id, dietary_preference, spice_level, cuisine_preference, sweet_tooth, profile_update_date) VALUES (?, ?, ?, ?, ?, ?)",
      [
        profile.user_id,
        profile.dietary_preference,
        profile.spice_level,
        profile.cuisine_preference,
        profile.sweet_tooth,
        profile.profile_update_date,
      ]
    );
    console.log("User Profile Created Successfully!");
  }

  public async updateProfile(profile: EmployeeProfile): Promise<void> {
    const today = new Date().toISOString().split("T")[0];
    await db.execute(
      "UPDATE Employee_Profile SET dietary_preference = ?, spice_level = ?, cuisine_preference = ?, sweet_tooth = ?, profile_update_date = ? WHERE user_id = ?",
      [
        profile.dietary_preference,
        profile.spice_level,
        profile.cuisine_preference,
        profile.sweet_tooth,
        profile.profile_update_date,
        profile.user_id,
      ]
    );
    console.log("User Profile Updated Successfully!");
  }

  public async getEmployeeProfileByUserId(
    user_id: number
  ): Promise<EmployeeProfile | null> {
    const [rows] = await db.execute(
      "SELECT * FROM Employee_Profile WHERE user_id = ?",
      [user_id]
    );
    const profiles = rows as EmployeeProfile[];
    return profiles.length > 0 ? profiles[0] : null;
  }
}
