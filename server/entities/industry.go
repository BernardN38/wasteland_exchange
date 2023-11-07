package entities

import "errors"

type Industry struct {
	Name         string            `json:"name"`
	Cash         int32             `json:"cash"`
	Inventory    IndustryInventory `json:"inventory"`
	InputSchema  IndustrySchema    `json:"input"`
	OutputSchema IndustrySchema    `json:"output"`
}

type IndustrySchema struct {
	Goods []IndustrySchemaGood `json:"good"`
}

func (industry *Industry) SimProduction() {
	for {
		for _, v := range industry.InputSchema.Goods {
			goodAvailable, ok := industry.Inventory.Goods[v.Good.Name]
			if !ok {
				continue
			}
			if goodAvailable.QuantityAvailable >= v.QuantityNeeded {
				goodAvailable.QuantityAvailable -= v.QuantityNeeded
				v.QuantityNeeded = 0
			}

		}
	}
}

func (i *Industry) Sell(goodName string, quantity int32) error {
	good := i.Inventory.Goods[goodName]
	if good.QuantityAvailable > quantity {
		good.QuantityAvailable -= quantity
		i.Cash -= quantity * good.CurrentPrice
		return nil
	}
	return errors.New("unable to complete transaction")
}

func (i *Industry) Purchase(goodName string, quantity int32) error {
	good := i.Inventory.Goods[goodName]
	if good.QuantityAvailable > quantity {
		good.QuantityAvailable += quantity
		i.Cash += quantity * good.CurrentPrice
		return nil
	}
	return errors.New("unable to complete transaction")
}
