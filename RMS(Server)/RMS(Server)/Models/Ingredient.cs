﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace RMS_Server_.Models
{
    public class Ingredient
    {
        [Key]
        public int Id { get; set; }
        public float Quantity { get; set; }
        public Inventory Inventory { get; set; }
        public int InventoryId { get; set; }
        public float SubTotal { get; set; }
        public FoodItem FoodItem { get; set; }
        public int FoodItemId { get; set; }
    }
}