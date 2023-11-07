package entities

import entity_interfaces "github.com/bernardn38/wasteland_exchange/server/entities/interfaces"

type Actor struct {
	Name          string           `json:"name"`
	Health        int32            `json:"health"`
	Skills        map[string]int32 `json:"skills"`
	Inventory     ActorInventory   `json:"invenotry"`
	CarryCapacity float32          `json:"carryCapacity"`
	Caravan       Caravan          `json:"caravan"`
}

func (a *Actor) Travel(startingCord entity_interfaces.Cord, endCord entity_interfaces.Cord) error {
	return nil
}

func (a *Actor) ChangeMoney(amount int32) {
	a.Inventory.Goods["money"].QuantityAvailable += amount
}
