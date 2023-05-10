# Como configurar entidades con ```TypeORM```

1. Crear módulo con el comando
```bash
nest g <nombre del módulo> --no-spec
``` 

2. Definir columnas en el archivo ```<nombre del módulo>.entity.ts``` 

##### Ejemplo:
```typescript
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;
}
```

3. Importar el módulo en el archivo ```<nombre del módulo>.module.ts```

##### Ejemplo
```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
})
export class UserModule {}
```


