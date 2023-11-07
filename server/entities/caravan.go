package entities

type Caravan struct {
	Transports []Transport `json:"transports"`
	Speed      float32     `json:"speed"`
}

// func (c *Caravan) GetGood(goodName string) error {

// }
