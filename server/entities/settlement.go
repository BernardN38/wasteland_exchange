package entities

type Settlement struct {
	Name       string     `json:"settlement"`
	Industries []Industry `json:"industries"`
	Market     Market     `json:"market"`
}
