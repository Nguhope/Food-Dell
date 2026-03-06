import './MyOrder.css'
import { assets } from '../../assets/assets'

const MyOrders = () => {
  return (
    <div className='my-orders'>
      <h2>My Orders</h2>
      <div className="container">
        {data.map((order,index) =>{

          return(
            <div key={index} className="my-orders-order">
              <img src={assets.parcel_icon} alt=""  />
              <p>{order.item.map((item, index) =>{

                if(index === order.items.length-1) {
                  return item.name+ " x " +item.quantity
                }

                 else{

                     return item.name+ "x" +item.quantity+ ","


                 }



              })}</p>

              <p>${order.amount}.00</p>
              <p>Items: {order.Items.length}</p>


            </div>
          )




        })}
      </div>
      
    </div>
  );
}

export default MyOrders;
