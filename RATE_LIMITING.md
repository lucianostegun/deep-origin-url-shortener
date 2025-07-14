# Rate Limiting Implementation

## 📋 Visão Geral

Implementado um sistema de rate limiting para prevenir abuso na criação de URLs encurtadas, limitando o número de requests por usuário em uma janela de tempo específica.

## 🛡️ Configuração Atual

### Backend Rate Limit:

- **Janela de Tempo**: 1 minuto (60.000ms)
- **Máximo de URLs**: 10 por minuto por usuário
- **Identificação**: Header `user-id`
- **Armazenamento**: Memória local (em produção, use Redis)

### Resposta de Erro:

- **Status Code**: 429 (Too Many Requests)
- **Mensagem**: "Muitas URLs criadas. Aguarde 1 minuto antes de criar outra."

## 🔧 Implementação Técnica

### 1. **RateLimitGuard** (`api/src/common/guards/rate-limit.guard.ts`)

```typescript
@RateLimit({
  windowMs: 60 * 1000,     // 1 minuto
  maxRequests: 10,         // 10 URLs por minuto
  message: 'Mensagem customizada'
})
```

### 2. **Controller** (`api/src/urls/urls.controller.ts`)

```typescript
@UseGuards(AuthGuard, RateLimitGuard)
@Post()
@RateLimit({
  windowMs: 60 * 1000,
  maxRequests: 10,
  message: 'Muitas URLs criadas. Aguarde 1 minuto antes de criar outra.'
})
create(@Body() createUrlDto: CreateUrlDto, @CurrentUser() user: User) {
  return this.urlsService.create(createUrlDto, user.id);
}
```

### 3. **Frontend Error Handling** (`app/src/components/UrlShortenerForm/UrlShortenerForm.tsx`)

```typescript
if (response.status === 429) {
  throw new Error(json.message || 'Muitas solicitações. Tente novamente em alguns instantes.');
}
```

## 🎯 Funcionamento

### Fluxo Normal:

1. ✅ Usuário cria URL → Contador incrementado
2. ✅ Usuário dentro do limite → URL criada com sucesso
3. ✅ Lista atualizada automaticamente

### Fluxo Rate Limited:

1. 🚫 Usuário excede limite → Error 429 retornado
2. 🚫 Frontend exibe mensagem de erro
3. ⏰ Usuário deve aguardar até a janela resetar

### Reset da Janela:

- 🔄 **Automático**: Após 1 minuto da primeira request
- 🔄 **Contador**: Volta para 0 quando janela expira
- 🔄 **Nova Janela**: Próxima request inicia nova contagem

## 📊 Monitoramento

### Logs de Rate Limiting:

```bash
# Verificar rate limits em ação
docker-compose logs api | grep "Rate limit"
```

### Headers de Response (futuros):

- `X-RateLimit-Limit`: Limite máximo
- `X-RateLimit-Remaining`: Requests restantes
- `X-RateLimit-Reset`: Timestamp do reset

## ⚙️ Configuração Avançada

### Para Produção com Redis:

```typescript
// Substitua o Map por Redis
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisRateLimitService {
  constructor(private redis: Redis) {}

  async checkRateLimit(key: string, config: RateLimitConfig) {
    const current = await this.redis.incr(key);
    if (current === 1) {
      await this.redis.expire(key, Math.ceil(config.windowMs / 1000));
    }
    return current <= config.maxRequests;
  }
}
```

### Configurações Personalizadas:

```typescript
// Rate limit mais restritivo para alguns usuários
@RateLimit({
  windowMs: 5 * 60 * 1000,  // 5 minutos
  maxRequests: 5,           // 5 URLs por 5 minutos
  message: 'Limite restrito ativo'
})

// Rate limit mais permissivo
@RateLimit({
  windowMs: 60 * 1000,      // 1 minuto
  maxRequests: 50,          // 50 URLs por minuto
  message: 'Limite aumentado'
})
```

## 🧪 Testando Rate Limiting

### Teste Manual:

1. Crie 10 URLs rapidamente
2. Tente criar a 11ª URL
3. Deve receber erro 429
4. Aguarde 1 minuto e tente novamente

### Teste Automatizado:

```bash
# Script para testar rate limiting
for i in {1..15}; do
  curl -X POST http://localhost:3000/urls \
    -H "Content-Type: application/json" \
    -H "user-id: test-user" \
    -d '{"url":"https://example.com/'$i'"}' \
    && echo " - Request $i: Success" \
    || echo " - Request $i: Rate Limited"
done
```

## 🔒 Segurança

### Benefícios:

✅ **Previne Spam**: Impede criação massiva de URLs  
✅ **Protege Recursos**: Evita sobrecarga do servidor  
✅ **Controla Custos**: Limita uso excessivo  
✅ **Melhora Performance**: Mantém sistema responsivo

### Considerações:

- Rate limit por `user-id` (requer usuário válido)
- Armazenamento em memória (resetado com restart)
- Mensagens de erro claras para o usuário
- Frontend trata erros graciosamente

## 📈 Métricas Recomendadas

Para monitoramento em produção:

- Número total de rate limits ativados
- Usuários mais frequentemente limitados
- Distribuição de requests por janela de tempo
- Taxa de retry após rate limit
