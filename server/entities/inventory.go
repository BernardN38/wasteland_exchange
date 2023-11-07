package entities

type MarketInventory struct {
	Goods    map[string]*MarketGood `json:"goods"`
	Capacity float32                `json:"capacity"`
}

type ActorInventory struct {
	Goods    map[string]*ActorGood `json:"goods"`
	Capacity float32               `json:"capacity"`
}
type TransportInventory struct {
	Goods    map[string]int32 `json:"goods"`
	Capacity float32          `json:"capacity"`
}

type IndustryInventory struct {
	Goods    map[string]*MarketGood `json:"goods"`
	Capacity float32                `json:"capacity"`
}
