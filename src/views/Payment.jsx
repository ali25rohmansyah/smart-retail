
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
import CurrencyFormat from 'react-currency-format';
import fire from "firebs.js";
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

            moneyChange:'',
        }
    }

    setCart = () => {
        const db = fire.firestore();
        let qty, total

        db.collection('list_item').doc('01').collection('item').get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    db.collection('product').where('name', '==', doc.data().name).get()
                        .then(snapshot => {
                            snapshot.forEach(doc2 => {
                                qty = 1
                                total = qty * doc2.data().price
                                db.collection('cart').doc('01').collection('item').doc(doc2.data().name).set({
                                    name: doc2.data().name,
                                    qty: qty,
                                    total: total
                                })
                            });
                        })
                });
            })
            .catch(error => {
                console.log('Error!', error);
            })
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
    }
    
    moneyReceived(e) {
        this.setState({
            moneyChange: e.value
        })
    }

    submitForm = () => {
        this.setState({
            modalCash: !this.state.modalCash,
            modalDetail: !this.state.modalDetail
        })
        let recieved = this.state.moneyChange - this.total_price
        swal("Success!", "Your Change : "+( recieved), "success");
    }

    componentDidMount(){
        // get data from firestore
        this.getData()
    }

    render() {
        // get detail item
        this.detailItem()
        this.setCart()

        let totalPrice = 0
        let listDetailItem = this.state.detail_item.map((val, i) => {
            totalPrice = totalPrice + val.total

            i = i + 1
            return (
                <>
                    <tr key={i}>
                        <td>{i}</td>
                        <td>{val.name}</td>
                        <td>{val.qty}</td>
                        <td><CurrencyFormat value={val.total} displayType={'text'} thousandSeparator={true}/></td>
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
                                    <i className="fas fa-coins" /> <CurrencyFormat value={total} displayType={'text'} thousandSeparator={true} prefix={'RP. '} />
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
                            <CurrencyFormat 
                                className="form-control"
                                thousandSeparator={true} prefix={'Rp. '} 
                                onValueChange={this.moneyReceived.bind(this)}
                                placeholder=""
                                type="text"
                                />
                            <Input
                            />
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
                        <Button color="primary" onClick={this.showModalCash}><CurrencyFormat value={totalPrice} displayType={'text'} thousandSeparator={true} prefix={'Rp. '} /></Button>
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

export default Dashboard;
