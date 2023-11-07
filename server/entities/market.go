package entities

import (
	// "crypto/rand"
	"log"
	"time"
)

type Market struct {
	Name      string          `json:"marketName"`
	Inventory MarketInventory `json:"inventory"`
}

func (m *Market) ChangeMoney(amount int32) {
	m.Inventory.Goods["money"].QuantityAvailable += amount
}

func (m *Market) MarketSimulation() {
	ticker := time.NewTicker(time.Second * 5)
	for range ticker.C {
		// startTime := time.Now().UnixMicro()
		for i := range m.Inventory.Goods {
			m.AdjustPriceBasedOnDemand(i)
		}
		// endTime := time.Now().UnixMicro()
		// log.Println(" price update execution time: ", endTime-startTime, "microseconds")
	}
}

func (m *Market) AdjustPriceBasedOnDemand(goodName string) {
	if goodName == "money" {
		return
	}

	good := m.Inventory.Goods[goodName]
	if good == nil {
		log.Println("Good not found")
		return
	}
	// Calculate the ratio of demand to supply
	demand := float32(good.Demand)
	supply := float32(good.QuantityAvailable)
	priceChangeFactor := float32(1.0)

	if supply > 0 {
		// Price adjustment formula: new price = old price * (1 + change factor)
		priceChangeFactor = 0.01 * (demand/supply - 0.50)

		log.Println(priceChangeFactor)
	}
	// if priceChangeFactor
	newPrice := int32(float32(good.CurrentPrice) * (1.0 + priceChangeFactor))

	if newPrice < good.Good.BaseValue/3 {
		newPrice = good.Good.BaseValue // Ensure the price doesn't go below 1
	}
	if newPrice > good.Good.BaseValue*4 && demand > 0 {
		newPrice = int32(float64(good.CurrentPrice) * 1.001)
	}

	good.CurrentPrice = newPrice
}
