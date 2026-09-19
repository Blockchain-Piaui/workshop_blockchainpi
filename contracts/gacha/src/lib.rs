#![no_std]

use soroban_sdk::{contract, contracterror, contractevent, contractimpl, contracttype, symbol_short, Address, Env, Symbol};
use soroban_sdk::token::TokenClient;

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    SacNativo,
    Resultado(Address),
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum GachaError {
    NaoAutorizado = 1,
    PagamentoInsuficiente = 2,
    ResultadoJaExiste = 3,
}

const PRECO_STROOPS: i128 = 10_000_000; // 1 XLM

#[contractevent]
pub struct BauAberto {
    #[topic]
    pub usuario: Address,
    pub resultado: Symbol,
}

#[contract]
pub struct GachaContract;

#[contractimpl]
impl GachaContract {
    pub fn init(env: Env, sac_address: Address) {
        env.storage().instance().set(&DataKey::SacNativo, &sac_address);
    }

    pub fn abrir_bau(env: Env, usuario: Address) -> Result<Symbol, GachaError> {
        usuario.require_auth();

        let sac_address: Address = env
            .storage()
            .instance()
            .get(&DataKey::SacNativo)
            .unwrap();

        let token_client = TokenClient::new(&env, &sac_address);
        token_client.transfer(&usuario, &env.current_contract_address(), &PRECO_STROOPS);

        let resultado = Self::sortear(&env);

        env.storage()
            .persistent()
            .set(&DataKey::Resultado(usuario.clone()), &resultado);

        BauAberto {
            usuario: usuario.clone(),
            resultado: resultado.clone(),
        }
        .publish(&env);

        Ok(resultado)
    }

    pub fn ler_resultado(env: Env, usuario: Address) -> Option<Symbol> {
        env.storage()
            .persistent()
            .get(&DataKey::Resultado(usuario))
    }
}

impl GachaContract {
    fn sortear(env: &Env) -> Symbol {
        let r: u64 = env.prng().gen_range(0..10_000);

        match r {
            0..=4 => symbol_short!("Bucket"),
            5..=54 => symbol_short!("Botton"),
            55..=354 => symbol_short!("Chaveiro"),
            _ => symbol_short!("Nada"),
        }
    }
}

#[cfg(test)]
mod test;
