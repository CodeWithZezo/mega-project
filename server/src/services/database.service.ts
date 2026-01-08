import mongoose from 'mongoose';
import { getDatabaseConfig } from '../config/database';
import { logger } from '../utils/logger';
import { DatabaseError } from '../utils/errors';

export class DatabaseService {
  private static instance: DatabaseService;
  private isConnected = false;
  private connectionAttempts = 0;
  private readonly maxRetries = 5;
  private readonly retryDelay = 5000;

  private constructor() {}

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  async connect(): Promise<void> {
    if (this.isConnected) {
      logger.warn('Database is already connected');
      return;
    }

    const config = getDatabaseConfig();

    try {
      await mongoose.connect(config.uri, config.options);
      this.isConnected = true;
      this.connectionAttempts = 0;
      
      logger.info('MongoDB connected successfully', {
        host: mongoose.connection.host,
        name: mongoose.connection.name,
      });

      this.setupEventHandlers();
    } catch (error) {
      this.connectionAttempts++;
      logger.error('MongoDB connection error', error);

      if (this.connectionAttempts < this.maxRetries) {
        logger.info(`Retrying connection... Attempt ${this.connectionAttempts}/${this.maxRetries}`);
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        return this.connect();
      }

      throw new DatabaseError('Failed to connect to MongoDB after multiple attempts');
    }
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) {
      logger.warn('Database is not connected');
      return;
    }

    try {
      await mongoose.connection.close();
      this.isConnected = false;
      logger.info('MongoDB disconnected successfully');
    } catch (error) {
      logger.error('MongoDB disconnection error', error);
      throw new DatabaseError('Failed to disconnect from MongoDB');
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      if (!this.isConnected) return false;
      
      const state = mongoose.connection.readyState;
      // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
      return state === 1;
    } catch (error) {
      logger.error('Database health check failed', error);
      return false;
    }
  }

  getConnection() {
    if (!this.isConnected) {
      throw new DatabaseError('Database is not connected');
    }
    return mongoose.connection;
  }

  private setupEventHandlers(): void {
    mongoose.connection.on('connected', () => {
      logger.info('Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (error) => {
      logger.error('Mongoose connection error', error);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('Mongoose disconnected from MongoDB');
      this.isConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('Mongoose reconnected to MongoDB');
      this.isConnected = true;
    });

    // Handle process termination
    process.on('SIGINT', async () => {
      await this.disconnect();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      await this.disconnect();
      process.exit(0);
    });
  }
}