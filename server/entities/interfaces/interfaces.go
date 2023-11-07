package entity_interfaces

// type Vendor interface {
// 	Purchase(goodName string, quantity int32) error
// 	Sell(goodName string, quantity int32) error
// }

type Cord struct {
	X float32 `json:"x"`
	Y float32 `json:"y"`
	Z float32 `json:"z"`
}

type Traveler interface {
	Travel(startCord Cord, endCord Cord) error
}
