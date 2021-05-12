package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strconv"
	"time"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/hyperledger/fabric/protos/peer"
)

type Event struct {
	ID        string    `json:"id"`
	Lanes     []int     `json:"lanes"`
	Image     []byte    `json:"image"`
	CreatedAt time.Time `json:"created_at"`
	Metadata  string    `json:"metadata"`
}

func (e *Event) Init(stub shim.ChaincodeStubInterface) peer.Response {
	return shim.Success(nil)
}

func (e *Event) Invoke(stub shim.ChaincodeStubInterface) peer.Response {
	fn, args := stub.GetFunctionAndParameters()

	if fn == "register-event" {
		return RegisterEvent(stub, args)
	} else if fn == "get-event" {
		return GetEvent(stub, args)
	}
	return shim.Error("Unknown function")
}

func RegisterEvent(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	lane_1, _ := strconv.Atoi(args[1])
	lane_2, _ := strconv.Atoi(args[2])
	lanes := []int{lane_1, lane_2}

	image := []byte(args[3])
	unix_time_int, _ := strconv.Atoi(args[4])
	unix_time := time.Unix(int64(unix_time_int), 0)

	postBody, _ := json.Marshal(map[string]interface{}{
		"id":         args[0],
		"lanes":      lanes,
		"image":      image,
		"created_at": unix_time,
		"metadata":   args[5],
	})
	responseBody := bytes.NewBuffer(postBody)

	resp, err := http.Post("http://mock:3000/check", "application/json", responseBody)
	if err != nil {
		fmt.Println(err)
		return shim.Error(err.Error())
	}
	defer resp.Body.Close()
	bodyBytes, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println(err)
		return shim.Error(err.Error())
	}
	if string(bodyBytes) == "Yes" {
		return shim.Success(nil)
	}
	return shim.Error("Failed")
}

func GetEvent(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	value, err := stub.GetState(args[0])
	if err != nil {
		fmt.Println(err.Error())
		return shim.Error(err.Error())
	}
	return shim.Success([]byte(string(value)))
}

func main() {
	if err := shim.Start(new(Event)); err != nil {
		fmt.Println("Error starting...")
	}
}
