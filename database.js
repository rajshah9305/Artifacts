import { Pool } from 'pg'; 

class Database { 
 constructor(config) { 
  this.config = config; 
  this.pool = null; 
  this.isConnected = false; 
 } 

 async connect() { 
  if (this.pool) { 
   return this.pool; 
  } 

  try { 
   this.pool = new Pool({ 
    host: this.config.host, 
    port: this.config.port, 
    database: this.config.name, 
    user: this.config.user, 
    password: this.config.password, 
    min: this.config.pool?.min || 2, 
    max: this.config.pool?.max || 10, 
    idleTimeoutMillis: 30000 
   }); 

   const client = await this.pool.connect(); 
   client.release(); 

   this.isConnected = true; 
   console.log('Database connection established successfully'); 

   this.pool.on('error', (err) => { 
    console.error('Unexpected database error:', err); 
    this.isConnected = false; 
   }); 

   return this.pool; 
  } catch (error) { 
   console.error('Failed to connect to database:', error); 
   this.isConnected = false; 
   throw error; 
  } 
 } 

 async query(text, params = []) { 
  if (!this.pool) { 
   await this.connect(); 
  } 

  try { 
   const result = await this
