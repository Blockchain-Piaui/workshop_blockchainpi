#![cfg(test)]
extern crate std;

use soroban_sdk::{contract, contractimpl, symbol_short, testutils::Address as _, Address, Env, Symbol};
use crate::{DataKey, GachaContract, GachaContractClient};

#[contract]
struct MockToken;

#[contractimpl]
impl MockToken {
    pub fn transfer(_env: Env, from: Address, _to: Address, _amount: i128) {
        from.require_auth();
    }
}

#[test]
fn test_init() {
    let env = Env::default();
    let sac_address = Address::generate(&env);
    let contract_id = env.register(GachaContract, ());
    let client = GachaContractClient::new(&env, &contract_id);
    client.init(&sac_address);

    let stored_sac: Address = env.as_contract(&contract_id, || {
        env.storage().instance().get(&DataKey::SacNativo).unwrap()
    });
    assert_eq!(stored_sac, sac_address);
}

#[test]
fn test_ler_resultado_none_for_unknown() {
    let env = Env::default();
    let sac_address = Address::generate(&env);
    let contract_id = env.register(GachaContract, ());
    let client = GachaContractClient::new(&env, &contract_id);
    client.init(&sac_address);

    let user = Address::generate(&env);
    assert_eq!(client.ler_resultado(&user), None);
}

#[test]
fn test_sortear_distribution() {
    let env = Env::default();
    let contract_id = env.register(GachaContract, ());

    let mut bucket_count: u64 = 0;
    let mut botton_count: u64 = 0;
    let mut chaveiro_count: u64 = 0;
    let mut nada_count: u64 = 0;
    let iterations = 100_000;

    for _ in 0..iterations {
        let result: Symbol = env.as_contract(&contract_id, || {
            crate::GachaContract::sortear(&env)
        });
        match result {
            s if s == symbol_short!("Bucket") => bucket_count += 1,
            s if s == symbol_short!("Botton") => botton_count += 1,
            s if s == symbol_short!("Chaveiro") => chaveiro_count += 1,
            _ => nada_count += 1,
        }
    }

    assert_eq!(bucket_count + botton_count + chaveiro_count + nada_count, iterations);

    // Bucket: ~0.05% → ~50 in 100k (allow 0-150)
    assert!(bucket_count <= 150, "bucket count {bucket_count} out of range");
    // Botton: ~0.50% → ~500 in 100k (allow 200-800)
    assert!(botton_count >= 200 && botton_count <= 800, "botton count {botton_count} out of range");
    // Chaveiro: ~3.00% → ~3000 in 100k (allow 1500-4500)
    assert!(chaveiro_count >= 1500 && chaveiro_count <= 4500, "chaveiro count {chaveiro_count} out of range");
    // Nada: ~96.45% → ~96450 in 100k (allow 94000-98000)
    assert!(nada_count >= 94000 && nada_count <= 98000, "nada count {nada_count} out of range");
}

#[test]
#[should_panic(expected = "Auth")]
fn test_abrir_bau_requires_auth() {
    let env = Env::default();
    let token_id = env.register(MockToken, ());
    let contract_id = env.register(GachaContract, ());
    let client = GachaContractClient::new(&env, &contract_id);
    client.init(&token_id);

    let user = Address::generate(&env);
    client.abrir_bau(&user);
}

#[test]
fn test_abrir_bau_success() {
    let env = Env::default();
    let token_id = env.register(MockToken, ());
    let contract_id = env.register(GachaContract, ());
    let client = GachaContractClient::new(&env, &contract_id);
    client.init(&token_id);

    let user = Address::generate(&env);
    env.mock_all_auths();

    let result = client.try_abrir_bau(&user);
    match result {
        Ok(Ok(symbol)) => {
            assert!(
                symbol == symbol_short!("Bucket")
                    || symbol == symbol_short!("Botton")
                    || symbol == symbol_short!("Chaveiro")
                    || symbol == symbol_short!("Nada"),
                "unexpected result: {:?}",
                symbol
            );
        }
        other => panic!("expected Ok(Ok(symbol)), got {:?}", other),
    }

    // Verify result was stored
    let stored = client.ler_resultado(&user);
    assert!(stored.is_some());
}

#[test]
fn test_resultado_ja_existe() {
    let env = Env::default();
    let token_id = env.register(MockToken, ());
    let contract_id = env.register(GachaContract, ());
    let client = GachaContractClient::new(&env, &contract_id);
    client.init(&token_id);

    let user = Address::generate(&env);

    // Manually set a result to simulate a previous gacha
    env.as_contract(&contract_id, || {
        env.storage()
            .persistent()
            .set(&DataKey::Resultado(user.clone()), &symbol_short!("Nada"));
    });

    env.mock_all_auths();

    let result = client.try_abrir_bau(&user);
    // The result should be an error - either contract error or host error
    // Both indicate the duplicate check is working
    assert!(result.is_err() || result.unwrap().is_err(), "expected error for duplicate result");
}
