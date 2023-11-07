package trade

import "github.com/bernardn38/wasteland_exchange/server/entities"

// TradeResult represents the result of a trade.
type TradeResult struct {
	Success    bool
	Message    string
	NewBalance int32
}

// ExecuteTrade performs a trade between an actor and a market.
func ExecuteTrade(actor *entities.Actor, market *entities.Market, goodName string, quantity int32) TradeResult {
	// Check if the market has the required goods to buy

	marketGood, exists := market.Inventory.Goods[goodName]
	if !exists || marketGood.QuantityAvailable < quantity {
		return TradeResult{Success: false, Message: "Market does not have enough goods to sell", NewBalance: actor.Inventory.Goods["money"].QuantityAvailable}
	}

	// Check if the actor has enough money to buy the goods
	totalCost := quantity * marketGood.CurrentPrice
	actorMoneyAvailible, exists := actor.Inventory.Goods[entities.GOOD_MONEY.Name]
	if !exists || actorMoneyAvailible.QuantityAvailable < totalCost {
		return TradeResult{Success: false, Message: "Not enough money to buy goods", NewBalance: actor.Inventory.Goods["money"].QuantityAvailable}
	}

	// Trade is valid, update the actor's and market's inventories, and deduct money from the actor

	marketGoodToSell := market.Inventory.Goods[goodName]
	marketGoodToSell.QuantityAvailable -= quantity
	marketGoodToSell.Demand += quantity
	go market.AdjustPriceBasedOnDemand(goodName)
	actorGoodToBuy, exists := actor.Inventory.Goods[goodName]
	if !exists {
		actor.Inventory.Goods[goodName] = &entities.ActorGood{
			Good:              entities.GOODS_MAP[goodName],
			PurchasePrice:     marketGood.CurrentPrice,
			QuantityAvailable: quantity,
		}
	} else {
		actorGoodToBuy.QuantityAvailable += quantity
	}

	market.ChangeMoney(totalCost)
	actor.ChangeMoney(-totalCost)

	return TradeResult{Success: true, Message: "Trade successful", NewBalance: actor.Inventory.Goods["money"].QuantityAvailable}
}
