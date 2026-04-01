# Hatemalo Bakery - Use Case Diagram

## Overview
This document presents the use case diagram for the Hatemalo Bakery e-commerce platform, illustrating all actors, use cases, and their relationships within the system.

## Use Case Diagram

```plantuml
@startuml Hatemalo_Bakery_UseCase
!define ACTOR_BG #FFE5CC
!define USECASE_BG #CCE5FF

skinparam ActorBackgroundColor ACTOR_BG
skinparam UsecaseBackgroundColor USECASE_BG
skinparam ArrowColor #333333
skinparam BackgroundColor #FAFAFA

actor Customer as cust #FFE5CC
actor Administrator as admin #FFE5CC

rectangle "Hatemalo Bakery System" {
    
    ' Customer Features
    usecase "Register/Login" as UC1
    usecase "Browse Products" as UC2
    usecase "Search Products" as UC3
    usecase "Add to Cart" as UC4
    usecase "Checkout" as UC5
    usecase "Place Order" as UC6
    usecase "View Order History" as UC7
    
    ' Admin Features
    usecase "Admin Login" as UC8
    usecase "Manage Products" as UC9
    usecase "Manage Categories" as UC10
    usecase "Manage Orders" as UC11
}

' Customer Relationships
cust --> UC1
cust --> UC2
cust --> UC3
cust --> UC4
cust --> UC5
cust --> UC7

' Customer Flow
UC1 --> UC2 : enables
UC2 -.-> UC3 : extends
UC2 --> UC4 : accesses
UC4 --> UC5 : includes
UC5 --> UC6 : includes
UC1 --> UC7 : enables

' Admin Relationships
admin --> UC8
UC8 --> UC9
UC8 --> UC10
UC8 --> UC11

@enduml
```

## Actor Descriptions

### Customer
An end user who can browse the product catalog, search for items, manage a shopping cart, and place orders. Customers must register and login to view their order history.

### Administrator
A staff member responsible for managing products, categories, and customer orders in the system.

## Key Use Cases Description

### Customer Use Cases

- **Register/Login**: Customers create accounts and authenticate to access personalized features
- **Browse Products**: Customers view all available bakery products
- **Search Products**: Customers search for specific products using keywords
- **Add to Cart**: Customers add products to their shopping cart
- **Checkout**: Customers proceed to checkout and enter delivery details
- **Place Order**: Customers submit their order for processing
- **View Order History**: Authenticated customers can view their previous orders

### Admin Use Cases

- **Admin Login**: Administrator authenticates to access management features
- **Manage Products**: Administrator can create, edit, and delete products
- **Manage Categories**: Administrator can organize products through categories
- **Manage Orders**: Administrator can view and update customer orders

---

**Last Updated**: April 1, 2026
**Project**: Hatemalo Bakery E-commerce Platform
**Version**: 1.0
