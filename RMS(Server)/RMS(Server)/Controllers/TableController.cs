﻿using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web.Http;
using RMS_Server_.Models;

namespace RMS_Server_.Controllers
{
    public class TableController : ApiController
    {
        private readonly ApplicationDbContext _context;
        private TableController()
        {
            _context = new ApplicationDbContext();
        }

        [HttpGet]
        [Route("api/GetAllTable")]
        public IHttpActionResult GetAllTable()
        {

            List<Table> tables = _context.Tables.
                Include(x => x.Orders).
                OrderByDescending(y => y.Id).
                ToList();
            List<OrderSession> orderSessions = _context.OrderSessions.Include(c => c.Order).ToList();
            List<OrderedItem> orderedItems = _context.OrderedItems.Include(c => c.OrderSession).ToList();

            return Ok(tables);
        }

        [HttpPost]
        [Route("api/AddNewTable")]

        public IHttpActionResult AddNewTable(Table table)
        {
            if (table != null)
            {
                _context.Tables.Add(table);
                _context.SaveChanges();
                return Ok();
            }

            return NotFound();
        }

        [HttpPut]
        [Route("api/EditTable")]
        public IHttpActionResult EditTable(Table table)
        {
            Table getEdited = _context.Tables.FirstOrDefault(p => p.Id == table.Id);
            if (getEdited != null)
            {
                getEdited.Name = table.Name;
                _context.SaveChanges();
                return Ok();
            }

            return NotFound();
        }




        [HttpDelete]
        [Route("api/DeleteTable/{tableId}")]
        public IHttpActionResult DeleteTable(int tableId)
        {

            Table deleteTable = _context.Tables.Include(x => x.Orders).FirstOrDefault(p => p.Id == tableId);
            if (deleteTable == null)
            {
                return NotFound();
            }
            
            if (deleteTable.Orders.Count != 0)
            {
                return Ok("Failed");
            }

            
            _context.Tables.Remove(deleteTable);
            _context.SaveChanges();
            return Ok();

        }


        [HttpPut]
        [Route("api/ChangeTableState")]
        public IHttpActionResult ChangeTableState(Table table)
        {
            Table changeTabeStateDefault = _context.Tables.FirstOrDefault(p => p.Id == table.Id);
            if (changeTabeStateDefault != null)
            {
                changeTabeStateDefault.CurrentState = table.CurrentState;
                _context.SaveChanges();
                return Ok();
            }

            return NotFound();
        }
    }
}
