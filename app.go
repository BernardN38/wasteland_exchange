package main

import (
	"context"
	"fmt"
	"net/http"

	"github.com/bernardn38/wasteland_exchange/server/entities"
	"github.com/bernardn38/wasteland_exchange/server/simulation"
)

// App struct
type App struct {
	ctx        context.Context
	simulation *simulation.Simulation
}

// NewApp creates a new App application struct
func NewApp() *App {
	simulation := simulation.New()
	go simulation.Start()
	return &App{
		simulation: simulation,
	}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	http.Handle("/frontend/src/assets", http.FileServer(http.Dir("assets")))
	a.ctx = ctx
}

func (a *App) GetMarkets() []*entities.Market {
	return a.simulation.Markets
}
func (a *App) GetMarket(marketIndex int) *entities.Market {
	return a.simulation.Markets[marketIndex]
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf(" %s!", name)
}
