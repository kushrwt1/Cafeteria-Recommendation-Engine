import { MenuItem } from "../Models/menuItem";
import { MenuItemRepository } from "../Utils/Database Repositories/menuItemRepository";
import { RecommendationService } from "../Services/recommendationService";
import { DiscardedMenuItemRepository } from "../Utils/Database Repositories/discardedMenuItemRepository";
import net from "net";
import { ServerProtocol } from "../Server/serverProtocol";

export class AdminController {
  private menuItemRepositoryObject = new MenuItemRepository();
  private recommendationService = new RecommendationService();
  private discardedMenuItemRepositoryObject = new DiscardedMenuItemRepository();

  public async addMenuItem(
    menuItem: {
      menu_item_id: 0;
      name: string;
      availability: boolean;
      price: number;
      meal_type_id: number;
      dietary_type: string;
      spice_level: string;
      cuisine_type: string;
      is_sweet: boolean;
    },
    socket: net.Socket
  ) {
    try {
      this.menuItemRepositoryObject.addMenuItem(menuItem, socket);
    } catch (error) {
      console.error(`Error adding menu item: ${error}`);
    }
  }

  public async updateMenuItem(menuItem: {
    menu_item_id: number;
    name: string;
    availability: boolean;
    price: number;
    meal_type_id: number;
    dietary_type: string;
    spice_level: string;
    cuisine_type: string;
    is_sweet: boolean;
  }) {
    try {
      this.menuItemRepositoryObject.updateMenuItem(menuItem);
    } catch (error) {
      console.error(`Error updating menu item: ${error}`);
    }
  }

  public async deleteMenuItem(menuItemId: number) {
    try {
      this.menuItemRepositoryObject.deleteMenuItem(menuItemId);
    } catch (error) {
      console.error(`Error deleting menu item: ${error}`);
    }
  }

  public async viewAllMenuItems(socket: net.Socket) {
    try {
      const menuItems = await this.menuItemRepositoryObject.getAllMenuItems();
      const menuItemsInStringFormat = JSON.stringify(menuItems);
      ServerProtocol.sendResponse(
        socket,
        "Response_viewAllMenuItems",
        {},
        { menuItemsInStringFormat },
        "json"
      );
    } catch (error) {
      console.error(`Error fetching all menu item: ${error}`);
    }
  }

  public async addDiscarededMenuItemsInDatabase() {
    try {
      const discardedItems =
        await this.recommendationService.getDiscardedMenuItems();
      console.log(
        "Discarded items retrieved from Recommendation Engine succeessfully"
      );

      const currentDate = new Date().toISOString().split("T")[0];
      for (const item of discardedItems) {
        await this.discardedMenuItemRepositoryObject.addDiscardedMenuItem({
          id: 0,
          menu_item_id: item.menu_item_id,
          discarded_date: currentDate,
          name: item.name,
        });
      }
    } catch (error) {
      console.error(
        "Error fetching Discarded items and Adding Discarded item into Database:",
        error
      );
      throw error;
    }
  }

  public async getMenuItemById(menuItemId: number) {
    const menuItem: MenuItem | null =
      await this.menuItemRepositoryObject.getMenuItemById(menuItemId);
    return menuItem;
  }

  public async sendAllDiscardedMenuItemsToClient(socket: net.Socket) {

    try {
      const discardedMenuItems =
        await this.discardedMenuItemRepositoryObject.getAllDiscardedMenuItems();
      const discardedMenuItemsInStringFormat =
        JSON.stringify(discardedMenuItems);
      ServerProtocol.sendResponse(
        socket,
        "Response_admin_viewDiscardedMenuItems",
        {},
        { discardedMenuItemsInStringFormat },
        "json"
      );

      console.log("Discarded Menu Items Sent To The client Successfully");
    } catch (error) {
      console.error(`Error fetching Discarded menu item: ${error}`);
    }
  }
}
