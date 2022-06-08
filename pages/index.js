import { Button, Container, Grid, Typography, TextField, InputAdornment, LinearProgress, Box, Paper, List, ListItemButton, ListItemText, ListItemIcon } from '@mui/material'
import { useEffect, useState } from 'react';
import { useAuth } from '../utils/auth';
import { useLocalState } from '../utils/state';

import DnsIcon from '@mui/icons-material/Dns';

import { canisters, minting_canister } from '../utils/canisters.js';
import { getSubaccountFromPrincipal, getSubAccountArray } from '../utils/utils';
import { Principal } from "@dfinity/principal";


const Wrapper = ({ children }) => {
  return (
    <Box>
      <Container maxWidth="lg">
        {children}
      </Container>
    </Box>
  );
}

export default function Home() {
  const auth = useAuth();
  const state = useLocalState();

  const [selectedIndex, setSelectedIndex] = useState(0);

  const [cycles, setCycles] = useState(null);

  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState(1);
  const [canisterId, setCanisterId] = useState(canisters[0].canister);
  const [standard, setStandard] = useState(null);

  const handleListItemClick = (
    event,
    index,
  ) => {
    setSelectedIndex(index);

    if (index >= 0) {
      setCanisterId(canisters[index].canister);
      setCycles(null);
      getCycles(canisters[index].canister);
    } else {
      setCanisterId("");
      setCycles(null);
    }
  };

  async function getCycles(canisterId) {
    let index = selectedIndex;

    let actor = state.getReadActor(canisterId);

    try {
      let cycles = await actor.get_cycles();
      let t_cycles = Number(cycles) / Math.pow(10, 12);
      setCycles(t_cycles);

    } catch (e) {
      console.log("get_cycles: " + e);
    }

    try {
      let cycles = await actor.availableCycles();
      let t_cycles = Number(cycles) / Math.pow(10, 12);
      setCycles(t_cycles);
    } catch (e) {
      console.log("availableCycles: " + e);
    }
  }

  useEffect(() => {
    if (auth.wallet === null || auth.wallet === undefined) return;

    async function balance() {
      try {
        let balance = await auth.wallet.getBalance();

        setBalance(balance[0].amount);
      } catch (e) {
        console.error(e);
      }
    }

    balance();
  }, [auth.wallet])


  useEffect(() => {
    setCycles(null);

    const timer = setInterval(async () => {
      try {
        let id = Principal.from(canisterId);

        // let item = canisters[selectedIndex];
        getCycles(canisterId);
      } catch (e) {
      }
    }, 1000);
    return () => clearInterval(timer);

  }, [canisterId, state]);



  const handleChange = (prop) => (event) => {
    if (prop === 'amount') {
      setAmount(event.target.value);
    }
    if (prop === 'canisterId') {
      setCanisterId(event.target.value);
    }
  };


  const topup = async () => {
    await state.topupCanister(canisterId, Number(amount));
  }

  return (
    <Wrapper>
      <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }} marginTop={1}>
        <Grid item xs={12}>
          <Paper sx={{ p: 1 }}>
            Welcome to canister <strong>TOP UP</strong> site! You can top up any canister using this site with ICP from your wallet.
            <br /><br />
            In order to top up a canister you need to select a canister from the list on the left (if you want to top up an arbitrary canister, select Custom Canister). Connect your wallet, enter ICP amount and click TOP UP!
            <br /><br />
            You can top up any canister, however we can only display number of cycles for Giga721 and EXT canisters.
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper sx={{ p: 1 }}>

            <List component="nav" aria-label="main mailbox folders">
              <ListItemButton
                selected={selectedIndex === -1}
                onClick={(event) => handleListItemClick(event, -1)}>
                <ListItemIcon>
                  <DnsIcon />
                </ListItemIcon>
                <ListItemText primary="Custom Canister" />
              </ListItemButton>
              {
                canisters.map((x, index) =>
                  <ListItemButton key={index}
                    selected={selectedIndex === index}
                    onClick={(event) => handleListItemClick(event, index)}>
                    <ListItemIcon>
                      <DnsIcon />
                    </ListItemIcon>
                    <ListItemText primary={x.name} secondary={x.cycles} />
                  </ListItemButton>
                )
              }
            </List>
          </Paper>

        </Grid>
        <Grid item xs={9}>
          <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={12}>
              <Paper sx={{ p: 1 }}>
                <Grid container rowSpacing={4} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                  <Grid item xs={4}>
                    Current cycles: <strong>{cycles}</strong>
                  </Grid>

                </Grid>
              </Paper>
            </Grid>



            <Grid item xs={12}>
              <Paper sx={{ p: 1 }}>
                {auth.principal === undefined || auth.principal === null ? <>Connect your wallet to top up canisters</> :
                  <>
                    <Grid container rowSpacing={4} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                      <Grid item xs={8}>
                        <TextField
                          disabled={selectedIndex !== -1}
                          variant="outlined"
                          required
                          id="outlined-required"
                          label="Canister Id"
                          fullWidth
                          InputProps={{
                            endAdornment: <InputAdornment position="end">Id</InputAdornment>,
                          }}
                          value={canisterId}
                          onChange={handleChange('canisterId')}
                        />
                      </Grid>
                      <Grid item xs={8}>
                        <TextField
                          variant="outlined"
                          required
                          id="outlined-required"
                          label="Amount to Top up"
                          fullWidth
                          InputProps={{
                            endAdornment: <InputAdornment position="end">ICP</InputAdornment>,
                          }}
                          value={amount}
                          onChange={handleChange('amount')}
                        />
                        Enter number of ICP that you would like to top up.
                      </Grid>
                      <Grid item xs={12} textAlign={'center'}>
                        <Button variant="contained" size="large" onClick={topup}>TOP UP</Button>
                      </Grid>
                    </Grid>
                  </>}
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Wrapper>
  )
}
