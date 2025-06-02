<?php

function getProduct($id, $quantity){
    require_once 'model/Product.php';
    require '../config/db.php';
    $p = new Product($conn);
    $product = $p->getProductByIdAndStock($id, $quantity) ?? null;
    if(!$product){
        echo json_encode(['error'=>'Product is not in stock for that quantity!']);
        exit();
    }

    return $product;
}
function getCartProducts(){
    require_once 'model/Cart.php';
    require '../config/db.php';

    $c = new Cart($conn, $_SESSION['user_id']);
    $cart_items = $c->getUserItems() ?? null;

    if(!$cart_items){
        echo json_encode(['error'=>'Cart is empty!']);
        exit();
    }

    return $cart_items;
}