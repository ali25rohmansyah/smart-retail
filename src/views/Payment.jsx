
import React from "react";
// reactstrap components
import swal from 'sweetalert';
import {
    Input,
    Button, 
    Table,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    CardTitle,
    Row,
    Col,
    FormGroup,
    Form,
    Modal, ModalHeader, ModalBody, ModalFooter, Container
} from "reactstrap";
import fire from "fire.js";
// core components

class Dashboard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            modalDetail: false,
            modalCash: false,
            cart: [],
            activeCart: '00',

            // detail items
            detail_item: [],
            total_price: 0,

            moneyChange:''
        }
    }

    // Cart
    getData = () => {
        const db = fire.firestore();
        let getCart = []
        let id
        let collectData

        db.collection('cart').get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    id = { id: doc.id }
                    collectData = {...id, ...doc.data()}
                    getCart.push(collectData)
                });
                this.setState({ cart: getCart })
            })
            .catch(error => {
                console.log('Error!', error);
            })
    }
    // detail item

    detailItem = ()=> {
        const db = fire.firestore();

        let getItem = []
        db.collection('cart').doc(this.state.activeCart).collection('item').get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    getItem.push(doc.data())
                });
                this.setState({ detail_item: getItem, })
            })
            .catch(error => {
                console.log('Error!', error);
            })
    }

    showModal = () => this.setState(state => ({
        modalDetail: !state.modalDetail,
        modalCash: false,
        })
    )
    

    showModalCash = () => this.setState(state => ({
        modalCash: !state.modalCash
    }))

    cancelModalCash = () => this.setState(state => ({
        modalCash: false
    }))  
    
    setActiveCart(i, x) {
        this.setState({
            activeCart: i,
            total_price: x
        })
        this.detailItem()
    }
    
    moneyReceived(e) {
        this.setState({
            moneyChange: e.target.value
        })
    }

    submitForm = () => {
        this.setState({
            modalCash: !this.state.modalCash,
            modalDetail: !this.state.modalDetail
        })
        swal("Success!", "Your Change : "+( this.state.moneyChange - this.state.total_price), "success");
    }

    render() {

        // get data from firestore
        this.getData()

        let listDetailItem = this.state.detail_item.map((val, i) => {
            
            i = i + 1
            return (
                <>
                    <tr key={i}>
                        <td>{i}</td>
                        <td>{val.name}</td>
                        <td>{val.qty}</td>
                        <td><ConvertToRupiah number={val.total} /></td>
                    </tr>
                </>
            )
        })
        let listCart = this.state.cart.map((val, i) => {
            let total = val.total_item
            let status = val.status
            let id =  val.id
            i = i + 1
            return (
                <>
                    <Col key={i} lg="3" md="6" sm="6" onClick={() => { this.setActiveCart(id, total) }}>
                        <Card className="card-stats" onClick={status ? this.showModal : ''}>
                            <CardBody>
                                <Row>
                                    <Col md="4" xs="5">
                                        <div className="icon-big text-center icon-warning">
                                            {status ? (
                                                <i className="nc-icon nc-cart-simple text-success" />
                                            ) : (
                                                <i style={{color:"grey"}} className="nc-icon nc-cart-simple" />
                                            )}
                                        </div>
                                    </Col>
                                    <Col md="8" xs="7">
                                        <div className="numbers">
                                            <p className="card-category">{i}</p>
                                            {status ? (
                                                <CardTitle tag="p">Active</CardTitle>
                                            ) : (
                                                <CardTitle style={{ color: "grey" }} tag="p">Inactive</CardTitle>
                                            )}
                                            <p />
                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>
                            <CardFooter>
                                <hr />
                                <div className="stats">
                                    <i className="fas fa-coins" /> {"Rp. "} <ConvertToRupiah number={total}/>
                                </div>
                            </CardFooter>
                        </Card>
                    </Col>
                </>
                )
            })
        return (
            <>
                {/* Modal Cash */}
                <Modal isOpen={this.state.modalCash} scrollable={true} centered={true} size={'sm'}>
                    <ModalHeader>Cash</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <label>money received</label>
                            <Input
                                onChange={this.moneyReceived.bind(this)}
                                placeholder=""
                                type="text"/>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.submitForm}>ok</Button>
                        <Button color="secondary" onClick={this.cancelModalCash}>Cancel</Button>
                    </ModalFooter>
                </Modal>

                {/* Modal Detail Payment */}
                <Modal isOpen={this.state.modalDetail} toggle={this.showModal} scrollable={true} centered={true} size={'xl'}>
                    <ModalHeader>Detail Payment Transaction {this.state.activeCart}</ModalHeader>
                    <ModalBody>
                        <Container>
                            <Row>
                                <Col md="12">
                                    <Row>
                                        <Col md="12">
                                            <Table>
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Item</th>
                                                        <th>Qty</th>
                                                        <th>Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {listDetailItem}
                                                </tbody>
                                            </Table>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Container>    
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.showModalCash}>Rp. <ConvertToRupiah number={this.state.total_price} /></Button>
                        <Button color="secondary" onClick={this.showModal}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            <div className="content">
                <Row>
                {listCart}  
                </Row>
            </div>
            </>
        );
    }
}

let ConvertToRupiah = (props) => {
    let number = props.number
    if (number) {

        var rupiah = "";

        var numberrev = number

            .toString()

            .split("")

            .reverse()

            .join("");

        for (var i = 0; i < numberrev.length; i++)

            if (i % 3 == 0) rupiah += numberrev.substr(i, 3) + ".";

        return (

            rupiah

                .split("", rupiah.length - 1)

                .reverse()

                .join("")

        );

    } else {

        return number;

    }

}

export default Dashboard;
