export default ({ IDL }) => {
  return IDL.Service({

    'get_cycles' : IDL.Func([], [IDL.Nat], ['query']),
    'availableCycles': IDL.Func([], [IDL.Nat], ['query']),

  });
};