package entities

type Good struct {
	Name      string `json:"name"`
	BaseValue int32  `json:"baseValue"`
}

type IndustrySchemaGood struct {
	Good           Good
	QuantityNeeded int32
}
type ActorGood struct {
	Good              Good
	PurchasePrice     int32
	QuantityAvailable int32
}

type MarketGood struct {
	Good              Good  `json:"good"`
	CurrentPrice      int32 `json:"currentPrice"`
	QuantityAvailable int32 `json:"quantityAvailable"`
	Demand            int32 `json:"demand"`
}

var (
	GOODS_MAP = map[string]Good{
		"forge": GOOD_FORGE,
		"money": GOOD_MONEY,
		"water": GOOD_WATER,
		"fuel":  GOOD_FUEL,
	}
	GOOD_FORGE = Good{
		Name:      "forge",
		BaseValue: 1000,
	}
	GOOD_FUEL = Good{
		Name:      "fuel",
		BaseValue: 2000,
	}
	GOOD_MONEY = Good{
		Name:      "money",
		BaseValue: 1,
	}
	GOOD_WATER = Good{
		Name:      "water",
		BaseValue: 500,
	}
)
