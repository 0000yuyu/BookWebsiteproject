import React , {useState,useEffect} from "react"
import {Link,useParams,useNavigate} from "react-router-dom";
import BookData from '../Data/book.json';
import BookImg from '../Data/book.jpg';
import {generateStars,calPrice,Popup,totalPrice} from '../Data/function';
import BookDetail from '../BookDetail/BookDetail'
import Data from '../Data/cart.json';

const ShoppingCart = () => {
    const [CartData,setCartData] = useState([]);
    const [message,setMessage] = useState('');
    const [popupOpen,setPopupOpen] = useState(false);
    const [SelectItem,setSelectItem] = useState([]);

    const navigate = useNavigate();
    const [CheckedState,setCheckedState] = useState(new Array(Data.length+1).fill(false));


    GetCart();
    function GetCart()
    {
        useEffect(()=>
        {
           //서버에서 할일 : 세션에 저장된 유저 아이디를 가져와 장바구니 정보를 가져오기
            fetch(`/api/cart`, {
                method: 'GET',
            })
            .then(response=>response.text())
            .then(data => setCartData(Data))
            .catch(error=>console.log(error))
        },[])
    }
    function onSubmitPurchase(items)
    {
        let totalPrice = calPrice();
    //구매 옵션 보내기
        fetch('/api/purchase', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(items)
        })
        .catch(error=>console.log(error))
        navigate('/purchase');
    }
    function AllPurchase()
    {
        onSubmitPurchase(CartData);
    }
    function CheckedPurchase()
    {
        onSubmitPurchase(SelectItem);
    }
    function handleChecked(book,index)
    {
        const newChecked = [...CheckedState];
        newChecked[index] = !newChecked[index];


        if (newChecked[index])
        {
            setSelectItem(prevItems=> [...prevItems,book]);
        }
        else
        {
            setSelectItem(
            prevItems=>prevItems.filter((item) => item != book))
        }
        setCheckedState(newChecked);
    }
    function isChecked(index)
      {return CheckedState[index];}
     function TotalPrice()
     {
        let total = 0;
        if (SelectItem.length != 0)
            total =  SelectItem.reduce((price,item)=>price+item.price,0)
        return total;
     }
     function itemDelete(item)
     {
        let totalPrice = calPrice();

        fetch('/api/cart/delete', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
        })
        .catch(error=>console.log(error))

     }
     function CheckedDelete()
     {
        for (let index=0;index< CartData.length;index++)
            if (CheckedState[index])
                itemDelete(CartData[index]);
        window.location.reload();
     }
     function AllDelete()
     {
        for(const item of SelectItem)
            itemDelete(item);
       window.location.reload();
     }
return (
    <div class="container">
        <div class="cart-top">
            <h2>장바구니</h2>
            {
                CartData.map((book,index) => (
                <div class="cart-item">
                    <input type="checkbox" class="cart-checkbox"
                    checked={isChecked(index)}
                    onChange={()=>handleChecked(book,index)}
                    ></input>
                    <div class="cart-item-info">
                        <h3>{book.title}</h3>
                        <p>{book.price}</p>
                        <p>{book.period}</p>
                        <p>구매 분류: <strong>{book.purchaseType}</strong></p>
                    </div>
                </div>
                ))
            }
        </div>


        <div class="cart-bottom">
            <h3>선택한 상품</h3>

            <table>
                <thead>
                    <tr>
                        <th>책 제목</th>
                        <th>구분</th>
                        <th>수량</th>
                        <th>상품금액</th>
                    </tr>
                </thead>
                <tbody>
                {
                    SelectItem.map((item,index)=>(
                        <tr class="selectedItem">
                            <td>{item.title}</td>
                            <td>{item.purchaseType}</td>
                            <td>{item.period}</td>
                            <td>{item.price}</td>
                        </tr>
                    ))
                }
                </tbody>
                <tfoot>
                    <tr>
                        <td >결제 예정 금액</td>
                        <td></td><td></td>
                        <td>{totalPrice(SelectItem)}</td>
                    </tr>
                </tfoot>
            </table>


            <div class="cart-actions">
                <button type="button" class="cart-checked-delete" onClick={CheckedDelete}>선택한 제품 삭제하기</button>
                <button type="button" class="cart-checked-purchase" onClick={CheckedPurchase}>선택한 제품 주문하기</button>
                <button type="button" class="cart-all-purchase" onClick={AllPurchase}>주문하기</button>
                <button type="button" class = "cart-all-delete" onClick={AllDelete}>장바구니 비우기</button>
            </div>
        </div>
    </div>
)}
export default ShoppingCart;