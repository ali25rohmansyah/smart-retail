
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

class Pay extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            // Modal
            modalDetail: false,
            modalCash: false,

            cart: [],
            item:[],
            detailItem:[],

        }
    }

    // Get cart from firestore
    getCart = () => {
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

    // get detailItem from firestore
    getDetailItem = () =>{
        const db = fire.firestore();

        db.collection('cart').doc('01').get()
            .then(snapshot => {
                this.setState({ item: snapshot.data().item })
                this.x()
            })
            .catch(error => {
                console.log('Error!', error);
            })
    }

    x = ()=>{
        const db = fire.firestore();

        let y =[]
        this.state.item.map((val, i) => {
            db.collection('product').where('name', '==', val.name).get().then(snapshot => {
                snapshot.forEach(doc => {
                    y.push({...{'name' : val.name}, ...{'qty' : val.qty}, ...{'price' : doc.data().price}})
                });
                this.setState({ detailItem: y })
            })     
        })
    }

    showModal = () => this.setState(state => ({
        modalDetail: !state.modalDetail,
        modalCash: false,
        })
    )

    modalDetail = () => this.setState(state => ({
        modalDetail: !state.modalDetail,
        modalCash: false,
        })
    )

    componentDidMount(){
        this.getCart()
    }
    render() {

        this.getDetailItem()

        // Get List Cart
        let listCart = this.state.cart.map((val, i) => {
            let total = val.total_item
            let status = val.status
            i = i + 1
            return (
                <>
                    <Col key={i} lg="3" md="6" sm="6">
                        <Card className="card-stats"  onClick={ this.modalDetail}>
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
        
        // Get List DetailItem
        let listDetailItem = this.state.detailItem.map((val, i) => {
            let totalPrice = val.qty + val.price
            return (
                <>
                    <tr key={i}>
                        <td>{i+1}</td>
                        <td>{val.name}</td>
                        <td>{val.qty}</td>
                        <td><CurrencyFormat value={totalPrice} displayType={'text'} thousandSeparator={true}/></td>
                    </tr>
                </>
            )
        })

        return (
            <>
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
                        {/* <Button color="primary" onClick={this.showModalCash}><CurrencyFormat value={totalPrice} displayType={'text'} thousandSeparator={true} prefix={'Rp. '} /></Button> */}
                        <Button color="secondary" onClick={this.showModal}>Cancel</Button>
                    </ModalFooter>
                </Modal>

                <div className="content">
                    <Row>
                        {listCart}  
                    </Row>
                </div>
            </>
        )
    }
}

export default Pay;
