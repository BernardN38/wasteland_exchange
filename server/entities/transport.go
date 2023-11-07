package entities

type Transport struct {
	Name          string
	Health        int32
	Inventory     TransportInventory
	CarryCapacity float32
	Cart          *Cart
}

type Cart struct {
	Name          string
	Health        int32
	Inventory     TransportInventory
	CarryCapacity float32
}
