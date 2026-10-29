import {randomBytes,createCipheriv,createDecipheriv} from 'node:crypto';
import {z} from 'zod';
export const credentials=z.object({email:z.string().email().max(200).transform(s=>s.toLowerCase()),password:z.string().min(8).max(100)});
export const registration=credentials.extend({name:z.string().trim().min(2).max(100),role:z.enum(['customer','cook'])});
export const kitchenSchema=z.object({images:z.array(z.string().regex(/^[a-f0-9]{24}$/i)).max(5).optional().default([]),kitchen:z.string().trim().min(2).max(100),bio:z.string().max(1000),city:z.string().trim().min(2).max(80),area:z.string().trim().min(2).max(100),cuisine:z.string().min(2).max(60),mealType:z.enum(['Veg','Non-Veg','Both']),daily:z.coerce.number().min(1).max(100000),weekly:z.coerce.number().min(1).max(500000),monthly:z.coerce.number().min(1).max(2000000),delivery:z.string().min(2).max(100),serviceArea:z.string().min(2).max(300)});
export const menuSchema=z.object({image:z.union([z.literal(''),z.string().regex(/^[a-f0-9]{24}$/i)]).optional().default(''),category:z.string().trim().max(60).optional().default(''),name:z.string().trim().min(2).max(100),mealType:z.enum(['Veg','Non-Veg']),price:z.coerce.number().min(1).max(100000),available:z.boolean(),delivery:z.string().min(2).max(100)});
function key(){const k=process.env.DATA_ENCRYPTION_KEY;if(!/^[a-f0-9]{64}$/i.test(k||''))throw new Error('DATA_ENCRYPTION_KEY must be 64 hex characters');return Buffer.from(k,'hex')}
export function encrypt(value){const iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',key(),iv);const data=Buffer.concat([cipher.update(value,'utf8'),cipher.final()]);return [iv.toString('hex'),cipher.getAuthTag().toString('hex'),data.toString('hex')].join(':')}
export function decrypt(value){const [iv,tag,data]=value.split(':');const cipher=createDecipheriv('aes-256-gcm',key(),Buffer.from(iv,'hex'));cipher.setAuthTag(Buffer.from(tag,'hex'));return Buffer.concat([cipher.update(Buffer.from(data,'hex')),cipher.final()]).toString('utf8')}

