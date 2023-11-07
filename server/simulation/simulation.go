package simulation

import (
	"time"

	"github.com/bernardn38/wasteland_exchange/server/entities"
)

type Simulation struct {
	Markets []*entities.Market `json:"markets"`
	Actors  []*entities.Actor  `json:"actors"`
}

var startingMarketInventory = entities.MarketInventory{
	Goods: map[string]*entities.MarketGood{
		entities.GOOD_FORGE.Name: {
			Good:              entities.GOOD_FORGE,
			CurrentPrice:      entities.GOOD_FORGE.BaseValue,
			QuantityAvailable: 1000,
		},
		entities.GOOD_MONEY.Name: {
			Good:              entities.GOOD_MONEY,
			CurrentPrice:      entities.GOOD_MONEY.BaseValue,
			QuantityAvailable: 10000,
			Demand:            0,
		},
		entities.GOOD_FUEL.Name: {
			Good:              entities.GOOD_FUEL,
			CurrentPrice:      entities.GOOD_FUEL.BaseValue,
			QuantityAvailable: 10000,
			Demand:            0,
		},
		entities.GOOD_WATER.Name: {
			Good:              entities.GOOD_WATER,
			CurrentPrice:      entities.GOOD_WATER.BaseValue,
			QuantityAvailable: 10000,
			Demand:            0,
		},
	},
	Capacity: 100000,
}

var (
	startingTransport = entities.Transport{
		Name:   "horse",
		Health: 100,
		Inventory: entities.TransportInventory{
			Goods: map[string]int32{
				entities.GOOD_MONEY.Name: 1000,
			},
			Capacity: 100,
		},
		CarryCapacity: 100,
		Cart:          nil,
	}
	startingCarvan = entities.Caravan{
		Transports: []entities.Transport{
			startingTransport,
		},
		Speed: 1,
	}
)
var (
	startingSkills = map[string]int32{
		"strength":     1,
		"intelligence": 1,
		"agility":      1,
	}
)

func New() *Simulation {
	// market1Goods := make(map[string]entities.MarketGood)
	// market1Goods := startingGoods
	firstMarket := entities.Market{
		Name:      "orion",
		Inventory: startingMarketInventory,
	}
	secondMarket := entities.Market{
		Name:      "flatRock",
		Inventory: startingMarketInventory,
	}
	thirdMarket := entities.Market{
		Name:      "greenville",
		Inventory: startingMarketInventory,
	}
	go firstMarket.MarketSimulation()
	go secondMarket.MarketSimulation()
	go thirdMarket.MarketSimulation()
	actor1 := entities.Actor{
		Name:   "eris",
		Skills: startingSkills,
		Inventory: entities.ActorInventory{
			Capacity: 0,
			Goods: map[string]*entities.ActorGood{
				entities.GOOD_MONEY.Name: &entities.ActorGood{
					Good:              entities.GOODS_MAP["money"],
					QuantityAvailable: 10000000,
				},
			},
		},
		CarryCapacity: 100,
		Caravan:       startingCarvan,
	}
	actor2 := entities.Actor{
		Name:   "adam",
		Skills: startingSkills,
		Inventory: entities.ActorInventory{
			Capacity: 0,
			Goods: map[string]*entities.ActorGood{
				entities.GOOD_MONEY.Name: &entities.ActorGood{
					Good:              entities.GOODS_MAP["money"],
					QuantityAvailable: 10000000,
				},
			},
		},
		CarryCapacity: 100,
		Caravan:       startingCarvan,
	}

	return &Simulation{
		Markets: []*entities.Market{
			&firstMarket,
			&secondMarket,
			&thirdMarket,
		},
		Actors: []*entities.Actor{
			&actor1,
			&actor2,
		},
	}
}

func (s *Simulation) Start() {
	go runSim()
}

type Handler struct {
	simulation *Simulation
}

func (h *Handler) GetMarket(marketName string) *entities.Market {
	markets := h.simulation.Markets
	for _, v := range markets {
		if v.Name == marketName {
			return v
		}
	}
	return nil
}
func runSim() {
	ticker := time.NewTicker(time.Second * 1)
	for range ticker.C {
		// fmt.Println("******************************************************************************************************")
		// startTime := time.Now().UnixMicro()
		// result := trade.ExecuteTrade(s.Actors[0], s.Markets[0], "forge", 205)
		// endTime := time.Now().UnixMicro()
		// log.Println(result, "execution time: ", endTime-startTime, "microseconds")
		// log.Printf("%+v", s.Markets[0].Inventory.Goods["money"])
		// // log.Printf("%+v", s.Markets[1])

		// log.Printf("%+v", s.Actors[0].Inventory.Goods["money"])
		// // log.Printf("%+v", s.Actors[1])

		// log.Printf("%+v", s.Markets[0].Inventory.Goods["forge"])
		// // log.Printf("%+v", s.Markets[1])
		// log.Printf("%+v", s.Actors[0].Inventory.Goods["forge"])
	}
}
