﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RMS_Server_.Models
{
    public class Setting
    {
        public int Id { get; set; }
        public string ShopName { get; set; }
        public string ShopAddress { get; set; }
        public string ShopPhone { get; set; }
        public string ShopEmail { get; set; }
        public string ShopFacebookPage { get; set; }
        public float? VatRate { get; set; }
        public string VatRegNumber { get; set; }
        public string VatType { get; set; }
        public float? ServiceChargeRate { get; set; }
        public string AdditionalInformation { get; set; }
        public bool PrintChefsOrderReceipt { get; set; }    
    }
}